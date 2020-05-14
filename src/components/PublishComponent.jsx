import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./styles/PublishComponent.css";

import ImageUploader from "./ImageUploader";

import { getCode, getNames } from "country-list";
import getCountryISO3 from "country-iso-2-to-3";

import { IpfsConnection } from "wb-ipfs";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { Link } from "react-router-dom";

import {abi, bytecode} from "wb-contracts/build/contracts/Offer.json"; //"../contracts/Offer.json"
import Web3 from "web3";
const myweb3 = new Web3(window.ethereum);

class PublishComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfs: "http://79.159.98.192:3000",
      //ipfs: "http://127.0.0.1:4000",
      registry: "0xb28bb545aCef6c7C7E81B66AA0c49f4c2F0D4639",
      account: "",
      title: "",
      price: "",
      description: "",
      category: "",
      country: "",
      checked: null,
      files: [],
      reset: false,
      plan_b: true,
    };
    this.getAccount();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.reset = this.reset.bind(this);
    this.revertReset = this.revertReset.bind(this);
  }

  async getAccount() {
    const accounts = await window.ethereum.enable();

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
    if (event.target.value === "") {
      this.setState({
        price: ""
      })
    }
    else {
      let n = parseInt(event.target.value, 10)
      if (!isNaN(n) && n >= 0) {
        this.setState({
          price: n
        })
      }
    }  
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
      "0x1F6f6DB45Cb287aC57B88C54743eb32a0df82f95"
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

  //PUBLISH handler
  async handleSubmit2(e) {
    e.preventDefault();

    //Check price is integer
    if (isNaN(parseInt(this.state.price, 10))) {
      console.log("Price is NaN!")

      //Error notification
      this.createNotification2('error', "El precio recibido no es válido.", "Precio inválido")

      return;
    }

    //File description
    let descr = null;
    if (this.state.description !== null && this.state.description !== "") {
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
        console.log("images uploaded to ipfs")

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

        const hex_country = Web3.utils.toHex(getCountryISO3(getCode(this.state.country)));

        this.createContract(
          this.state.account,
          hex_price,
          this.state.title,
          this.state.category,
          hex_country,
          cid,
          hex_deposit
        );

      })
      .catch((ex) => {
        console.log("Exception catched");
        console.log(ex);

        //Error notification
        this.createNotification2('error', "Ha surgido un error al subir las imágenes.", "IPFS error")
      });
  }



  async createContract(account, price, title, category, country, cid, deposit) {
    



      try {

        let myOffer = new myweb3.eth.Contract(abi, {
          from: account
        }); //, gasPrice: 2, gas: 6721975
    
        await myOffer
          .deploy({
            data: bytecode,
            arguments: [this.state.registry, price, title, category, country, cid],
          })
          .send({ value: deposit })
          .then((response) => {
            console.log("deploy response: ", response)

            if (this.state.plan_b) {
              //ElasticSearch
              const addr = response.options.from;
              const contract_addr = response._address;
              console.log("Nuevo contrato.addr: ", contract_addr);
              this.createDBEntry(contract_addr, addr, title, this.state.price, category, this.state.country, cid)
            }
           

            //Success notification
            this.createNotification2('success', "Su contrato ha sido creado correctmente.", "Contrato creado")

            //Reset form
            this.reset()
          })
          .catch((ex) => {
            console.log("deploy error: ", ex)

            //Error notification
            this.createNotification2('error', "Ha surgido un error al crear el contrato.", "Blockchain error")
          })

      } catch(ex) {
        console.log("Exception catched: ", ex)

        //Error notification
        this.createNotification2('error', "Ha surgido un error al crear el contrato.", "Blockchain error")
      } 
  }


  /***************************/
  /*********** ES ************/
  /***************************/
  async getDBCount2(url) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + new Buffer('webtest:webtest').toString('base64')
        }
      })

     // const res_js = res.json()
     const rj = await res.json()
      console.log("OK, result (dbcount): ", rj)
         
      const count = rj.count

      console.log(" count: ", count)
      return count;

    } catch (ex) {
      console.log("(count2) exception catched: ", ex)
          return -1;
    }

  }

  async callES(url, contract_addr, addr, title, price, category, country, cid) {
    await fetch(url , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + new Buffer('webtest:webtest').toString('base64')
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

    //const n_entries = await this.getDBCount2(url + "_count") + 1;

   // console.log("n_entries: ", n_entries)

    //console.log("n_entries +1: ", n_entries)

    const country_byte3 = getCountryISO3(getCode(country));


    const res_ES = this.callES(url + "_doc/" + contract_addr, contract_addr, addr, title, price, category, country_byte3, cid)
    console.log("result ES: ", res_ES)
  }
  /***********************/
  /***********************/
  /***********************/

  /*****NOTIFICATIONS*****/
  createNotification2 (type, msg, title) {
    console.log("CREATE NOTIFICATION()!!!")
    switch (type) {
        case 'info':
            NotificationManager.info(msg);
            break;
        case 'success':
            NotificationManager.success(msg, title);
            break;
        case 'warning':
            NotificationManager.warning(msg, 'Close after 3000ms', 3000);
            break;
        case 'error':
            NotificationManager.error(msg, title, 5000);
            break;
        default:
            break; 
    }
  }
  /***********************/

  reset() {
    console.log("publish reiniciamos!")

    
    
    this.setState({
      reset: true,
      title: "",
      price: "",
      description: "",
      category: "",
      country: "",
      checked: false,
      files: [],


    })
  }

  revertReset() {

    this.setState({
      reset: false
    })

  }


  render() {
    return (
      <div className="background">
        <div className="non-background">
          <div className="content">
            
            {/*
            <button onClick={() => {
              const hex_country = Web3.utils.toHex("ESP");


              const p1 = new Web3.utils.BN("10");
              const price = Web3.utils.toWei(p1);
              const hex_price = Web3.utils.toHex(price);

              const p2 = new Web3.utils.BN("20");
              const deposit = Web3.utils.toWei(p2);
              const hex_deposit = Web3.utils.toHex(deposit);

              this.createContract(this.state.account, hex_price, "titNewContract", "otros", hex_country, "cid inventat", hex_deposit)

            }}>Create contract</button>
          */}
          {/*
          <button onClick={this.getContracts2}> get contract info</button>
          */}
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
                      value={this.state.title}
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
                  value={this.state.description}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="Country">
                <Form.Label>País de origen</Form.Label>
                <Form.Control
                  as="select"
                  placeholder=""
                  name="country"
                  //onChange={this.handleCountryChange}
                  onChange={this.handleInputChange}
                  value={this.state.country}
                  required
                >
                  <option></option>
                  {getNames().map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="Category">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  onChange={this.handleInputChange}
                  value={this.state.category}
                  required
                >
                  <option></option>
                  <option>Electrodomesticos</option>
                  <option>Inmobiliaria</option>
                  <option>Moviles</option>
                  <option>Ordenadores</option>
                  <option>TV</option>
                  <option>Vehiculos</option>
                  <option>Otros</option>
                </Form.Control>
              </Form.Group>



              <br />

              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Acepto y comprendo los terminos de uso."
                  onChange={this.handleCheckChange}
                  checked={this.state.checked}
                  required
                />
              </Form.Group>

              <br />

              <ImageUploader onChange={this.fileHandler} reset={this.state.reset} revertReset={this.revertReset}/>

              <br />
              <br />

              <Link to={'/'}>
                <Button variant="secondary">Volver</Button>{' '}
              </Link>

              <Button type="submit">Publicar</Button>
            </Form>

            <NotificationContainer/>
          </div>
        </div>
      </div>
    );
  }
}

export default PublishComponent;
