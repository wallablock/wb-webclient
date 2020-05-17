import React, {Component} from "react";
import { withRouter } from "react-router-dom";

import getCountryISO2 from "country-iso-3-to-2";
import {getName} from "country-list";

import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Buy from "./Buy";

import "./styles/OfferDetail.css";

import {abi} from "wb-contracts/build/contracts/Offer.json";
import Web3 from "web3";

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
            state: null,
            seller: null,
            img_urls: null,
            descr: null,
            reset: false     
        }

        this.handleClick = this.handleClick.bind(this);
        this.revertReset = this.revertReset.bind(this);

        this.getAccount();
        this.getOfferInfo();
    }



    async getAccount() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.enable();
        
            this.setState({
                account: accounts[0],
            });
        }
    }

    async getContractData(contract_addr) {
        const contract = new this.props.web3.eth.Contract(
            abi,
            contract_addr
        );
    
        const title = await contract.methods.title().call();
        const priceWeis = await contract.methods.price().call();
        const category = await contract.methods.category().call();
        let shipsFrom = await contract.methods.shipsFrom().call();
        const cid = await contract.methods.attachedFiles().call();
        const state = await contract.methods.currentStatus().call();
        const seller = (await contract.methods.seller().call()).toLowerCase();


        shipsFrom = getName(getCountryISO2(Web3.utils.hexToUtf8(shipsFrom)))
        const priceEths = Web3.utils.fromWei(priceWeis)


        return {title, priceWeis, priceEths, category, shipsFrom, cid, state, seller};
    }

    async getIPFSData(cid) {       
        let img_urls = []
        let descr = null
        try {    
            img_urls = await this.props.ipfs.getAllImagesUrl(cid);

            descr = await this.props.ipfs.fetchDesc(cid);
        } catch (err) {
           console.error("Error from IPFS.read:", err);
        }

        return {img_urls, descr}    
    }

    async getOfferInfo() {
        const {title, priceWeis, priceEths, category, shipsFrom, cid, state, seller} = await this.getContractData(this.state.contract_addr)
        this.setState({
            title: title,
            priceWeis: priceWeis,
            priceEths: priceEths,
            category: category,
            shipsFrom: shipsFrom,
            cid: cid,
            state: state,
            seller: seller
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



        const contract = new this.props.web3.eth.Contract(
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

                //Reset
                this.setState({
                    reset: true
                })
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

    revertReset() {
        this.setState({
            reset: false
        })
    }

    render() {
        
        return (

 



            <div className="buy2-background">
                <div className="buy2-non-background">
                    <div className="buy-content">

                        {this.state.rdy ? 
                            (<Buy title={this.state.title} desc={this.state.descr} price={this.state.priceEths} category={this.state.category} country={this.state.shipsFrom} state={this.state.state} seller={this.state.seller} account={this.state.account} imgs={this.state.img_urls} buy={this.handleClick.bind(this)} reset={this.state.reset} revertReset={this.revertReset}/>) 
                            :<div>
                                <h3>Loading...</h3>
                            </div>
                        }       

                    </div>
                </div>
            </div>
            
        );
    }
}

export default withRouter(OfferDetail);