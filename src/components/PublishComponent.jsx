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

import { abi, bytecode } from "../contracts/Offer.json";
import Web3 from "web3";
const myweb3 = new Web3("ws://localhost:7545");

class PublishComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfs: "http://79.147.40.189:3000",
      account: null,
      title: null,
      price: null,
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

    this.setState({
      account: accounts[0],
    });

    //get private key
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
    this.setState({
      price: parseInt(event.target.value, 10),
    });
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

    let nuevaOferta = await myOffer
      .deploy({
        data: bytecode,
        arguments: [price, title, category, country, cid],
      })
      .send({ value: deposit });

    console.log("Nuevo contrato");
    console.log(nuevaOferta);
  }

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
                      type="number"
                      name="price"
                      placeholder="Precio en ethers"
                      onChange={this.handlePriceChange}
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
