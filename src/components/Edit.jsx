import React, { Component } from "react";
import Form from "react-bootstrap/Form";

import ImageUploader2 from "./ImageUploader2";

import { getName, getCode, getNames } from "country-list";
import getCountryISO3 from "country-iso-2-to-3";
import getCountryISO2 from "country-iso-3-to-2";

import {NotificationManager} from 'react-notifications';

import Offer from "wb-contracts/build/contracts/Offer.json"; //"../contracts/Offer.json"

import "./styles/Edit.css";

import Web3 from "web3";

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
            //files_ph: [],
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
        const contract = new this.props.web3.eth.Contract(Offer.abi, this.props.contract);

        const title_ph = await contract.methods.title().call()
        const price_weis = await contract.methods.price().call()
        const price_ph = Web3.utils.fromWei(price_weis)
        const country_ph = getName(getCountryISO2(Web3.utils.hexToAscii(await contract.methods.shipsFrom().call())))
        const category_ph = await contract.methods.category().call()

        //Contemplar cas quan no hi ha cid, hauriem de posarlo undefined o null o algo
        let cid = await contract.methods.attachedFiles().call();      
        if (cid === "") cid = null;

        //const imgs_ph = await this.initImgs(cid);
        //console.log("returned by initImgs, imgs_ph: ", imgs_ph)

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
            cid: cid,
            //files: imgs_ph,
            //files_ph: imgs_ph,
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


    countDecimals(num) {
        const arr = num.toString().split(".");
        if (arr.length === 1) return 0;

        return parseInt(arr[1].length);
    }

    handlePriceChange(event) {
        if (event.target.value === "") {
          this.setState({
            price: ""
          })
        }
        else {
            let n = event.target.value;
          //let n = parseInt(event.target.value, 10)
          if (!isNaN(n) && n >= 0 && this.countDecimals(n) < 13) {
            if (n > 5000) n = 5000;
            this.setState({
              price: n
            })
          }
        }  
      }

    async setTitle(e) {
        e.preventDefault();

        const contract = new this.props.web3.eth.Contract(Offer.abi, this.props.contract);
        await contract.methods.setTitle(this.state.title).send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de titulo");

            this.props.reload();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de titulo");
        })
    }

    async setPrice(e) {
        e.preventDefault();

        const contract = new this.props.web3.eth.Contract(Offer.abi, this.props.contract);
        const price_weis = Web3.utils.toWei(this.state.price);
        //const price_weis = Web3.utils.toWei(this.state.price.toString());

        if (this.state.price_weis < price_weis) {
            const deposit = await contract.methods.depositChangeForNewPrice(price_weis).call();
            console.log("deposit needed: ", Web3.utils.fromWei(deposit))
    
            await contract.methods.setPrice(price_weis).send({from: this.state.account, value: deposit})
            .then((response) => {
                //Success notification
                NotificationManager.success("Acción realizada con éxito.", "Cambio de precio");
                
                this.props.reload();
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

                this.props.reload();
            })
            .catch((ex) => {
                //Error notification
                NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de precio");
            })
        }
    }

    async setCountry(e) {
        e.preventDefault();

        const contract = new this.props.web3.eth.Contract(Offer.abi, this.props.contract)
        const alpha3_hex = Web3.utils.toHex(getCountryISO3(getCode(this.state.country)))
        await contract.methods.setShipsFrom(alpha3_hex).send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de país");

            this.props.reload();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de país");
        })
    }

    async setCategory(e) {
        e.preventDefault();

        const contract = new this.props.web3.eth.Contract(Offer.abi, this.props.contract);
        await contract.methods.setCategory(this.state.category).send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de categoría");

            this.props.reload();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de categoría");
        })
    }

    stringToArray(str) {
        let array = [];
        for (let i = 0; i < str.length; i++) {
          array.push(str[i]);
        }
        return array;
    }

    async setImages(files) {
        let cid = ""

        //Get description
        let fail = false
        const descr_s = await this.props.ipfs.fetchDesc(this.state.cid)
        .catch((ex) => {
            console.log("exception catched fetching descr, ex: ", ex)
            fail = true

            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de imágenes");
            return;
        })
        if (fail) return;

        let descr = null;
        if (descr_s != null) {
            const dsc_arr = this.stringToArray(descr_s);
            descr = new File(dsc_arr, "desc.txt", {
                type: "text/plain",
            });
        }

        //Upload imgs
        cid = await this.props.ipfs.uploadFiles(files, descr)
        .catch((ex) => {
            console.log("exception catched fetching descr, ex: ", ex)
            fail = true
            
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cambio de imágenes");
            return ;
        })
        if (fail) return; 
       

        //Update attachedFiles on contract
        const contract = new this.props.web3.eth.Contract(Offer.abi, this.props.contract);
        console.log("gonna update attachedFiles, cid: ", cid)
        await contract.methods.setAttachedFiles(cid).send({from: this.state.account})
        .then(response => {
            //Delete old cid
            //this.props.ipfs.delete(this.state.cid);

            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cambio de imágenes");

            this.props.reload();
        })
        .catch((ex) => {
            //Borrar cid creado
            //if (cid !== "") this.props.ipfs.delete(cid);

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
                                    <button type="submit" className="edit-btn" disabled={this.state.price.toString() === "" || Web3.utils.toWei(this.state.price.toString()) === Web3.utils.toWei(this.state.price_ph)}>Cambiar precio</button>
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
                                    <ImageUploader2 upload={this.setImages} cid={this.state.cid} ipfs={this.props.ipfs} /*files={this.state.files_ph} onChange={this.changeFiles}*//>
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