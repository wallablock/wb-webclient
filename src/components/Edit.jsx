import React, { Component } from "react";
import Form from "react-bootstrap/Form";

import ImageUploader2 from "./ImageUploader2";

import { getName, getCode, getNames } from "country-list";
import getCountryISO3 from "country-iso-2-to-3";
import getCountryISO2 from "country-iso-3-to-2";

import { IpfsConnection } from "wb-ipfs";

import {NotificationManager} from 'react-notifications';

import Offer from "wb-contracts/build/contracts/Offer.json"; //"../contracts/Offer.json"

import "./styles/Edit.css";

import Web3 from "web3";
const myweb3 = new Web3(window.ethereum);

//Props: close, contract
class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: "",
            title: "",
            price: "",
            price_weis: "",
            country: "",
            category: "",
            title_ph: "",
            price_ph: "",
            country_ph: "",
            category_ph: "",
            reset: false,
            files: [],
            cid: ""
        }

        this.changeFiles = this.changeFiles.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setCountry = this.setCountry.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setImages = this.setImages.bind(this);

        this.getAccount();
        this.preparePlaceHolders();
    }

    async getAccount() {
        const accounts = await window.ethereum.enable();
    
        this.setState({
          account: accounts[0],
        });
    }

    async preparePlaceHolders() {
        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);

        const title_ph = await contract.methods.title().call()
        const price_weis = await contract.methods.price().call()
        const price_ph = Web3.utils.fromWei(price_weis)
        const country_ph = getName(getCountryISO2(Web3.utils.hexToAscii(await contract.methods.shipsFrom().call())))
        const category_ph = await contract.methods.category().call()

        //Contemplar cas quan no hi ha cid, hauriem de posarlo undefined o null o algo
        const cid = await contract.methods.attachedFiles().call();        

        this.setState({
            title: title_ph,
            title_ph: title_ph,
            price: price_ph,
            price_ph: price_ph,
            price_weis: price_weis,
            country: country_ph,
            country_ph: country_ph,
            category: category_ph,
            category_ph: category_ph,
            cid: cid
        })
    }

    revertReset() {
        this.setState({
            reset: false
        })
    }

    changeFiles(files) {
        this.setState({
            files: files
        })
    }

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

    async setTitle(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        await contract.methods.setTitle(this.state.title).send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de titulo");
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de titulo");
        })
    }

    async setPrice(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        const price_weis = Web3.utils.toWei(this.state.price);

        if (this.state.price_weis < price_weis) {
            const deposit = await contract.methods.depositChangeForNewPrice(price_weis).call();
            console.log("deposit needed: ", Web3.utils.fromWei(deposit))
    
            await contract.methods.setPrice(price_weis).send({from: this.state.account, value: deposit})
            .then((response) => {
                //Success notification
                NotificationManager.success("Acción realizada con éxito.", "Cambio de precio");
            })
            .catch((ex) => {
                //Error notification
                NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de precio");
            })
        }
        else {
            console.log("NO deposit needed")
            await contract.methods.setPrice(price_weis).send({from: this.state.account})
            .then((response) => {
                //Success notification
                NotificationManager.success("Acción realizada con éxito.", "Cambio de precio");
            })
            .catch((ex) => {
                //Error notification
                NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de precio");
            })
        }
    }

    async setCountry(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract)
        const alpha3_hex = Web3.utils.toHex(getCountryISO3(getCode(this.state.country)))
        await contract.methods.setShipsFrom(alpha3_hex).send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de país");
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de país");
        })
    }

    async setCategory(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        await contract.methods.setCategory(this.state.category).send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de categoría");
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de categoría");
        })
    }

    async setImages() {
        let cid = ""

        //Init ipfs
        const myIpfs = new IpfsConnection("http://79.159.98.192:3000");

        if (this.state.files.length > 0) {
            //Get description
            let fail = false
            const descr = await myIpfs.fetchDesc(this.state.cid)
            .catch((ex) => {
                //console.log("exception catched fetching descr, ex: ", ex)

                //fail = true
                //Error notification
                //NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de imágenes");
                return ;
            })
            if (fail) return; //Check si no hi ha descripcio
            console.log("descr: ", descr)


            //Upload imgs
            cid = await myIpfs.uploadFiles(this.state.files, descr)
            .catch((ex) => {
                console.log("exception catched fetching descr, ex: ", ex)
                fail = true
                //Error notification
                NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de imágenes");
                return ;
            })
            if (fail) return; 
        }

        //Update attachedFiles on contract
        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        await contract.methods.setAttachedFiles(cid).send({from: this.state.account})
        .then(response => {
            //Delete old cid
            myIpfs.delete(this.state.cid);

            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de imágenes");
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de imágenes");
        })                
    }

    render() {
        return (
            <div className="offers_popup_background" onClick={this.props.close}>
                <div
                    className="offers_popup"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="edit-wrapper">

                        <Form onSubmit={this.setTitle}>
                            <div className="edit-field-group">
                                <Form.Label>Título</Form.Label>
                                <div className="edit-field-wrapper">
                                    <div className="edit-field-input">
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            placeholder={this.state.title_ph}
                                            onChange={this.handleInputChange}
                                            value={this.state.title}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="edit-btn" disabled={this.state.title === "" || this.state.title === this.state.title_ph}>Cambiar título</button>
                                </div>
                            </div>
                        </Form>

                        <Form onSubmit={this.setPrice}>
                            <div className="edit-field-group">
                                <Form.Label>Precio</Form.Label>
                                <div className="edit-field-wrapper">
                                    <div className="edit-field-input">
                                        <Form.Control
                                            type="text"
                                            name="price"
                                            placeholder={this.state.price_ph}
                                            onChange={this.handlePriceChange}
                                            value={this.state.price}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="edit-btn" disabled={this.state.price.toString() === "" || this.state.price === this.state.price_ph}>Cambiar precio</button>
                                </div>
                            </div>
                        </Form>


                        <Form onSubmit={this.setCountry}>
                            <div className="edit-field-group">
                                <Form.Label>País de origen</Form.Label>
                                <div className="edit-field-wrapper">
                                    <div className="edit-field-input">
                                        
                                    <Form.Control
                                        as="select"
                                        placeholder="Spain"
                                        name="country"
                                        //onChange={this.handleCountryChange}
                                        onChange={this.handleInputChange}
                                        value={this.state.country}

                                        required
                                    >
                                        {getNames().map((country) => (
                                            <option key={country}>{country}</option>
                                        ))}
                                    </Form.Control>


                                    </div>
                                    <button type="submit" className="edit-btn" disabled={this.state.country === "" || this.state.country === this.state.country_ph}>Cambiar país</button>
                                </div>
                            </div>
                        </Form>



                        <Form onSubmit={this.setCategory}>
                            <div className="edit-field-group">
                                <Form.Label>Categoría</Form.Label>
                                <div className="edit-field-wrapper">
                                    <div className="edit-field-input">

                                    <Form.Control
                                        as="select"
                                        name="category"
                                        onChange={this.handleInputChange}
                                        value={this.state.category}
                                        required
                                    >
                                        <option>Electrodomesticos</option>
                                        <option>Inmobiliaria</option>
                                        <option>Moviles</option>
                                        <option>Ordenadores</option>
                                        <option>TV</option>
                                        <option>Vehiculos</option>
                                        <option>Otros</option>
                                    </Form.Control>

                                    </div>
                                    <button type="submit" className="edit-btn" disabled={this.state.category === "" || this.state.category === this.state.category_ph}>Cambiar categoría</button>
                                </div>
                            </div>
                        </Form>

                        {this.state.cid !== "" ?
                            <div className="edit-field-wrapper">
                                <div className="edit-field-input">
                                    <ImageUploader2 cid={this.state.cid} onChange={this.changeFiles} reset={this.state.reset} revertReset={this.revertReset}/>
                                </div>
                                <button onClick={this.setImages} className="edit-btn">Cambiar imágenes</button>
                            </div>
                            :null
                        }
                       





                    </div>
                </div>
            </div>
        )
    }
}

export default Edit;