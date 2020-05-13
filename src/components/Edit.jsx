import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

import ImageUploader2 from "./ImageUploader2";

import { getCode, getNames } from "country-list";
import getCountryISO3 from "country-iso-2-to-3";

import { IpfsConnection } from "wb-ipfs";

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
            reset: false,
            files: [],
            cid: ""
        }

        this.changeFiles = this.changeFiles.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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


        //TESTING
        const cid = await contract.methods.attachedFiles().call();
        console.log("Edit, cid: ", cid)
        this.setState({
            cid: cid
        })

        

        this.setState({
            title_ph: title_ph,
            price_ph: price_ph,
            price_weis: price_weis,
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

    setTitle(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        contract.methods.setTitle(this.state.title).send({from: this.state.account})
    }

    async setPrice(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        const price_weis = Web3.utils.toWei(this.state.price);

        if (this.state.price_weis < price_weis) {
            const deposit = await contract.methods.depositChangeForNewPrice(price_weis).call();
            console.log("deposit needed: ", Web3.utils.fromWei(deposit))
    
            contract.methods.setPrice(price_weis).send({from: this.state.account, value: deposit})
        }
        else {
            console.log("NO deposit needed")
            contract.methods.setPrice(price_weis).send({from: this.state.account})
        }
    }

    setCountry(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract)
        const alpha3_hex = Web3.utils.toHex(getCountryISO3(getCode(this.state.country)))
        contract.methods.setShipsFrom(alpha3_hex).send({from: this.state.account})
    }

    setCategory(e) {
        e.preventDefault();

        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        contract.methods.setCategory(this.state.category).send({from: this.state.account})
    }

    async setImages() {
        let cid = ""
        if (this.state.files.length > 0) {
            //Init ipfs
            const myIpfs = new IpfsConnection("http://79.159.98.192:3000");

            //Get description
            const descr = myIpfs.fetchDesc(this.state.cid)

            //Upload imgs
            cid = await myIpfs.uploadFiles(this.state.files, descr)
        }

        //Update attachedFiles on contract
        const contract = new myweb3.eth.Contract(Offer.abi, this.props.contract);
        contract.methods.setAttachedFiles(cid).send({from: this.state.account})
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
                                    <button type="submit" className="edit-btn">Cambiar título</button>
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
                                            onChange={this.handleInputChange}
                                            value={this.state.price}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="edit-btn">Cambiar precio</button>
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
                                        <option></option>
                                        {getNames().map((country) => (
                                            <option key={country}>{country}</option>
                                        ))}
                                    </Form.Control>


                                    </div>
                                    <button type="submit" className="edit-btn">Cambiar país</button>
                                </div>
                            </div>
                        </Form>



                        <Form onSubmit={this.setCategory}>
                            <div className="edit-field-group">
                                <Form.Label>Categoria</Form.Label>
                                <div className="edit-field-wrapper">
                                    <div className="edit-field-input">

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

                                    </div>
                                    <button type="submit" className="edit-btn">Cambiar categoría</button>
                                </div>
                            </div>
                        </Form>

                        {this.state.cid != "" ?
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