import React, {Component} from "react";
import { withRouter } from "react-router-dom";

import { IpfsConnection } from "wb-ipfs";

import getCountryISO2 from "country-iso-3-to-2";
import {getName} from "country-list";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Buy from "./Buy";

import "./styles/OfferDetail.css";

import {abi} from "wb-contracts/build/contracts/Offer.json";
import Web3 from "web3";
const myweb3 = new Web3(window.ethereum);

class OfferDetail extends Component {
    constructor(props) {
        super(props);
        const offerId = this.props.match.params.offerId;

        this.state = {
            rdy: false,
            account: null,
            contract: null,
            contract_addr: offerId,
            title: null,
            priceWeis: null,
            priceEths: null,
            category: null,
            shipsFrom: null,
            cid: null,
            img_urls: null,
            descr: null        
        }

        this.handleClick = this.handleClick.bind(this);

        this.getAccount();
        this.getOfferInfo();
    }


    async getAccount() {
        const accounts = await window.ethereum.enable();
    
        this.setState({
          account: accounts[0],
        });
      }

    async getContractData(contract_addr) {
        const contract = new myweb3.eth.Contract(
            abi,
            contract_addr
        );

        console.log("contract");
        console.log(contract);

        //worth it guardar contrato en estado?
        this.setState({
            contract: contract
        })

    
        const title = await contract.methods.title().call();
        const priceWeis = await contract.methods.price().call();
        const category = await contract.methods.category().call();
        let shipsFrom = await contract.methods.shipsFrom().call();
        const cid = await contract.methods.attachedFiles().call();

        shipsFrom = getName(getCountryISO2(Web3.utils.hexToUtf8(shipsFrom)))
        const priceEths = Web3.utils.fromWei(priceWeis)


        console.log("Contract info");
        console.log(title);
        console.log(priceEths);
        console.log(category);
        console.log(shipsFrom);
        console.log(cid);

        return {title, priceWeis, priceEths, category, shipsFrom, cid};
    }

    async getIPFSData(cid) {
        const ipfsConnection = new IpfsConnection("http://79.147.40.189:3000");
       
        let img_urls = []
        let descr = null
        try {    
            img_urls = await ipfsConnection.getAllImagesUrl(cid);

            descr = await ipfsConnection.fetchDesc(cid);
        } catch (err) {
           console.error("Error from IPFS.read:", err);
        }


        console.log("IPFS info");
        console.log(img_urls);
        console.log(descr);

        return {img_urls, descr}    
    }

    async getOfferInfo() {
        const {title, priceWeis, priceEths, category, shipsFrom, cid} = await this.getContractData(this.state.contract_addr)
        this.setState({
            title: title,
            priceWeis: priceWeis,
            priceEths: priceEths,
            category: category,
            shipsFrom: shipsFrom,
            cid: cid
        })

        const {img_urls, descr} = await this.getIPFSData(cid)
        this.setState({
            img_urls: img_urls,
            descr: descr,
            rdy: true
        })
    }

    stringToArray(str) {
        let array = [];
        for (let i = 0; i < str.length; i++) {
          array.push(str[i]);
        }
        return array;
    }

    async handleClick(contact) {
        console.log("Comprar clicked")

        //Hay que substituir el hardcoded por la lectura de un campo e-mail
        const contactInfo = Web3.utils.toHex(contact)



        const contract = new myweb3.eth.Contract(
            abi,
            this.state.contract_addr,
            {
                from: this.state.account
            }
        );

        try {
            const deposit = await contract.methods.buyerDepositWithPayment().call()
            console.log("deposit: ", deposit)
    
            /*
            const res = await contract.methods.buy(contactInfo).send({
                value: deposit
            })
            
            console.log("bought(), res: ", res)
            */

            await contract.methods.buy(contactInfo).send({value: deposit})
            .then((response) => {
                console.log("buy() resp: ", response)

                //Success notification
                this.createNotification2('success', "Su compra se ha tramitado satisfactoriamente.", "Compra aceptada")
            })
            .catch((ex) => {
                console.log("buy exception: ", ex)

                //Error notification
                this.createNotification2('error', "Ha surgido un error en el proceso de compra.", "Blockchain error")
            })


        } catch(ex) {
            console.log("compra exception: ", ex)

            //Error notification
            this.createNotification2('error', "Ha surgido un error en el proceso de compra.", "Blockchain error")
        }

        

    }

    /*****NOTIFICATIONS*****/
    createNotification (type, msg, title) {
        console.log("CREATE NOTIFICATION()!!!")
        return () => {
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
            NotificationManager.error(msg, title, 5000, () => {
                alert('callback');
            });
            break;
        }
        }
    }

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
        }
    }
    /***********************/

    render() {
        
        return (

 



            <div className="buy-background">
                <div className="buy-non-background">
                    <div className="buy-content">

                        {this.state.rdy ? 
                            (<Buy title={this.state.title} desc={this.state.descr} price={this.state.priceEths} category={this.state.category} country={this.state.shipsFrom} imgs={this.state.img_urls} buy={this.handleClick.bind(this)}/>) 
                            : null
                        }       

                        <NotificationContainer/>
                    </div>
                </div>
            </div>
            
        );
    }
}

/*
                        <div className="buy-title-price">
                            <div className="buy-title">
                                <h2>{this.state.title}</h2>
                            </div>
                            <div className="buy-price">
                                <h2>{this.state.priceEths} Eths</h2>
                            </div>
                        </div>
    
                        <div className="buy-carrousel">
                            <MyCarousel imgs={this.state.img_urls}/>
                        </div>



                        <div className="categoria i shipsfrom">

                        </div>

                        <div className="descripcio">

                        </div>

                        <div className="boton">

                        </div>

*/




       /*
        <div>
            <h1>Comprar</h1>

            <p>Title</p>

            {this.state.title ?
                <p>{this.state.title}</p>
                :null
            }

            <p>Descripcion</p>

            {this.state.title ?
                <p>{this.state.descr}</p>
                :null
            }

            <p>Categoria</p>

            {this.state.title ?
                <p>{this.state.category}</p>
                :null
            }

            <p>Pais de origen</p>

            {this.state.title ?
                <p>{this.state.shipsFrom}</p>
                :null
            }

            <p>Precio</p>

            {this.state.title ?
                <p>{this.state.priceEths}</p>
                :null
            }

            <button onClick={this.handleClick}>Comprar</button>
            
            <NotificationContainer/>
        </div>
        */

export default withRouter(OfferDetail);