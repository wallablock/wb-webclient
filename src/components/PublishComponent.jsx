import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./styles/PublishComponent.css";

import ImageUploader from "./ImageUploader";

import { getCode, getNames } from "country-list";

import { IpfsConnection } from "wb-ipfs";

import getCountryISO3 from "country-iso-2-to-3";

import {abi, bytecode} from "wb-contracts/build/contracts/Offer.json"; //"../contracts/Offer.json"
import Web3 from "web3";
const myweb3 = new Web3(window.ethereum);

class PublishComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfs: "http://79.147.40.189:3000",
      account: null,
      title: null,
      price: "",
      description: null,
      category: null,
      country: null,
      checked: false,
      files: [],
      validated: false,
    };
    this.getAccount();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
  }

  async getAccount() {
    const accounts = await window.ethereum.enable();

    console.log("windows.ethereum: ", window.ethereum)

    this.setState({
      account: accounts[0],
    });
  }

  /** INPUT HANDLERS **/

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handlePriceChange(event) {
    let n = parseInt(event.target.value, 10)
    if (isNaN(n)) {
        n = ""
    }

    this.setState({
        price: n
    })
  }

  handleCountryChange(event) {
    this.setState({
      country: getCountryISO3(getCode(event.target.value)),
    });
  }

  handleCheckChange(event) {
    this.setState({
      checked: event.target.checked,
    });
  }

  fileHandler(_files) {
    this.setState({
      files: _files,
    });
  }

  /*******************/

  /****TESTING****/
  async getContracts2() {
    const contract = new myweb3.eth.Contract(
      abi,
      "0x436483DD9CEbe168d19D3Cb80E41Fe259F559d98"
    );
    console.log("readed contract");
    console.log(contract);

    const title = await contract.methods.title().call();
    const price = await contract.methods.price().call();
    const category = await contract.methods.category().call();
    const attachedFiles = await contract.methods.attachedFiles().call();

    console.log("Contract info");
    console.log(title);
    console.log(price);
    console.log(category);
    console.log(attachedFiles);
  }
  /*************/

  stringToArray(str) {
    let array = [];
    for (let i = 0; i < str.length; i++) {
      array.push(str[i]);
    }
    return array;
  }

  //IPFS library call
  async handleSubmit2(e) {
    e.preventDefault();

    //Check price is integer
    if (isNaN(parseInt(this.state.price, 10))) {
      console.log("Price is NaN!")
      return "";
    }

    //File description
    let descr = null;
    if (this.state.description != null && this.state.description != "") {
      const dsc_arr = this.stringToArray(this.state.description);

      descr = new File(dsc_arr, "desc.txt", {
        type: "text/plain",
      });
    }

    //IPFS image upload
    const myIpfs = new IpfsConnection(this.state.ipfs);

    await myIpfs
      .uploadFiles(this.state.files, descr)
      .then((response) => {
        //Smart contract

        const cid = response;
        console.log("cid");
        console.log(cid);

        const p1 = new Web3.utils.BN(this.state.price);
        const price = Web3.utils.toWei(p1);
        const hex_price = Web3.utils.toHex(price);

        const p2 = new Web3.utils.BN(this.state.price * 2);
        const deposit = Web3.utils.toWei(p2);
        const hex_deposit = Web3.utils.toHex(deposit);

        const hex_country = Web3.utils.toHex(this.state.country);

        this.createContract(
          this.state.account,
          hex_price,
          this.state.title,
          this.state.category,
          hex_country,
          cid,
          hex_deposit
        );
        
        
        //ElasticSearch
       //this.createDBEntry()

      })
      .catch((ex) => {
        console.log("Exception catched");
        console.log(ex);
      });
  }



  async createContract(account, price, title, category, country, cid, deposit) {
    let myOffer = new myweb3.eth.Contract(abi, {
      from: account,
      gasPrice: 2,
      gas: 6721975,
    }); //, gasPrice: 2, gas: 6721975

    let newContract = await myOffer
      .deploy({
        data: bytecode,
        arguments: [price, title, category, country, cid],
      })
      .send({ value: deposit });


      //ElasticSearch
      const addr = newContract.options.from;
      const contract_addr = newContract._address;
      console.log("Nuevo contrato.addr: ", addr);
      this.createDBEntry(contract_addr, addr, title, this.state.price, category, this.state.country, cid)
  }


  /***************************/
  /*********** ES ************/
  /***************************/
  async getDBCount(url) {
    await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer('webtest' + ":" + 'webtest').toString('base64')
      }
    })
      .then(res => res.json())
      .then (
        (result) => {
          console.log("OK, count: ", result.count)
          return result.count;
        },
        (error) => {
          console.log("Error: ", error)
          return -1;
        }
      )
  }

  async callES(url, contract_addr, addr, title, price, category, country, cid) {
    await fetch(url , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + new Buffer('webtest' + ":" + 'webtest').toString('base64')
      },
      body: JSON.stringify({
        offer: contract_addr, 
        seller: addr,  
        title: title, 
        price: price, 
        category: category, 
        shipsFrom: country, 
        bought: false, 
        cid: cid
      })
    })
      .then(res => res.json())
      .then (
        (result) => {
          console.log("OK, result: ", result)
          return result
        },
        (error) => {
          console.log("Error: ", error)
          return error;
        }
      )
  }

  async createDBEntry(contract_addr, addr, title, price, category, country, cid) {
    const url = "https://ae4d7ff23f8e4bcea2feecefc1b2337a.eu-central-1.aws.cloud.es.io:9243/testweb/";

    let n_entries = this.getDBCount(url + "_count") + 1;

    const res_ES = this.callES(url + "_doc/" + n_entries.toString(), contract_addr, addr, title, price, category, country, cid)
    console.log("result ES: ", res_ES)
  }
  /***********************/
  /***********************/
  /***********************/

  render() {
    return (
      <div className="background">
        <div className="non-background">
          <div className="content">
            <Form onSubmit={this.handleSubmit2.bind(this)}>
              <Form.Group controlId="TitleAndPrice">
                <Row>
                  <Col>
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Escribe un título para la oferta"
                      onChange={this.handleInputChange}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      placeholder="Precio en ethers"
                      onChange={this.handlePriceChange}
                      value={this.state.price}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="Description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows="3"
                  placeholder="Descripción del producto"
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="Category">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  onChange={this.handleInputChange}
                  required
                >
                  <option></option>
                  <option>TVs</option>
                  <option>Electrodomésticos</option>
                  <option>Móviles</option>
                  <option>Vehículos</option>
                  <option>Motos</option>
                  <option>Inmobiliaria</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="Country">
                <Form.Label>País de origen</Form.Label>
                <Form.Control
                  as="select"
                  placeholder=""
                  name="country"
                  onChange={this.handleCountryChange}
                  required
                >
                  <option></option>
                  {getNames().map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <br />

              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Acepto y comprendo los terminos de uso."
                  onChange={this.handleCheckChange}
                  required
                />
              </Form.Group>

              <br />

              <ImageUploader onChange={this.fileHandler} />

              <br />
              <br />

              <Button type="submit">Publicar</Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default PublishComponent;
