import React, { Component } from "react";
import "./styles/ViewAllOffers.css";

import { Link } from "react-router-dom";

import Edit from './Edit';
import PopupContactInfo from './PopupContactInfo';

import { NotificationManager} from 'react-notifications';

import Offer from "wb-contracts/build/contracts/Offer.json"; //"../contracts/Offer.json"
import OfferRegistry from "wb-contracts/build/contracts/OfferRegistry.json"; //"../contracts/Offer.json"
import Web3 from "web3";

class ViewAllOffers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            registry: this.props.config.registry,
            account: "",
            ipfs: this.props.ipfs,
            offers: [],
            edit: false,
            selected_edit: null,
            showContact: false,
            contactInfo: "",
        }
        this.load = this.load.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.coseContactInfo = this.coseContactInfo.bind(this);

        this.load();
    }

    async getAccount() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.enable();
        
            this.setState({
                account: accounts[0],
            });
        }
    }

    async checkBuyer(contract_addr, buyer) {
        //console.log("checkBuyer(), buyer: ", buyer);

        const contract = new this.props.web3.eth.Contract(Offer.abi, contract_addr);

        //Check pending withdraws
        const pendingWithdrawals = await contract.methods.pendingWithdrawals(buyer).call()
       // console.log("checkBuyer(), contract_addr: ", contract_addr);
        //console.log("checkBuyer(), pendingWithdrawals: ", pendingWithdrawals);
        if (pendingWithdrawals > 0) return true;

        //Check buyer & state
        const state = await contract.methods.currentStatus().call();
        let contract_buyer = await contract.methods.buyer().call();
        contract_buyer = contract_buyer.toLowerCase();
       // console.log("checkBuyer(), contract_addr: ", contract_addr);
      //  console.log("checkBuyer(), contract_buyer: ", contract_buyer);
        //console.log("checkBuyer(), state: ", state);
        if (contract_buyer === buyer && (state === "1" || state === "2")) return true;

       // console.log("checkBuyer() gonna return false, contract: ", contract_addr)
        return false;

    }

    async loadBuys(registry) {
        const buy_events = await registry.getPastEvents('Bought', {
            filter: {buyer: this.state.account},
            fromBlock: 0
        }/*, function(error, events) {console.log(events)}*/)
        /*.then(function(events) {   
            for (let i= 0; i < events.length; i++) {
                boughts.push(events[i].returnValues.offer)
            }            
        });*/


        let buys = []
        for (let i= 0; i < buy_events.length; i++) {
            const offer = buy_events[i].returnValues.offer;
            if (!buys.includes(offer) && await this.checkBuyer(offer, this.state.account))buys.push(offer)
        }

        return buys
    }

    async loadSells(registry) {
        const sell_events = await registry.getPastEvents('Created', {
            filter: {seller: this.state.account},
            fromBlock: 0
        }/*, function(error, events) {console.log(events)}*/)
        /*.then(function(events) { 
            let slls = []  
            for (let i= 0; i < events.length; i++) {
                slls.push(events[i].returnValues.offer)
            }
            return slls;            
        });*/


        let sells = []
        for (let i= 0; i < sell_events.length; i++) {
            sells.push(sell_events[i].returnValues.offer)
        }

        return sells
    }

    stateTranslator(state) {
        let translation;
        switch(state) {
            case "0":
                translation = "Esperando comprador"
                break;
            case "1":
                translation = "Esperando confirmación"
                break;
            case "2":
                translation = "Finalizada"
                break;
            case "3":
                translation = "Cancelada"
                break;
            default:
                translation = ""
                break;
        }

        return translation
    }

    async prepareData(sells, buys) {
        //Sells
        let sells_offer = []
        for (let i = 0; i < sells.length; i++) {
            //console.log("contract addr: ", sells[i])
            const contract = new this.props.web3.eth.Contract(Offer.abi, sells[i]);
            const st = await contract.methods.currentStatus().call();
            const offer = {
                contract_addr: sells[i],
                type: "Venta",
                title: await contract.methods.title().call(),
                price: Web3.utils.fromWei(await contract.methods.price().call()),
                state: st,
                stateTranslation: this.stateTranslator(st),
                pendingWithdrawals: await contract.methods.pendingWithdrawals(this.state.account).call(),
                img: this.state.ipfs.coverUrl(await contract.methods.attachedFiles().call()) //Check q fer if no imgs
            } 
           // console.log("contract: ", contract)
           // console.log("offer: ", offer)

            sells_offer.push(offer)
        }

        
        this.setState({
            //offers: this.state.offers.concat(sells_offer)
            offers: sells_offer
        })

        

        //Buys
        let buys_offer = []
        for (let i = 0; i < buys.length; i++) {
            //console.log("contract addr: ", buys[i])
            const contract = new this.props.web3.eth.Contract(Offer.abi, buys[i]);
            const st = await contract.methods.currentStatus().call();
            const offer = {
                contract_addr: buys[i],
                type: "Compra",
                title: await contract.methods.title().call(),
                price: Web3.utils.fromWei(await contract.methods.price().call()),
                state: st,
                stateTranslation: this.stateTranslator(st),
                pendingWithdrawals: await contract.methods.pendingWithdrawals(this.state.account).call(),
                img: this.state.ipfs.coverUrl(await contract.methods.attachedFiles().call()) //Check q fer if no imgs
            } 
            //console.log("contract: ", contract)
            //console.log("offer: ", offer)

            buys_offer.push(offer)
        }

        this.setState({
            offers: this.state.offers.concat(buys_offer)
        })
        
    }

    async load() {
        //No Ready
        if (this.state.ready) {
            this.setState({
                ready: false
            })   
        }

        await this.getAccount();
        if (this.state.account === "") return;

        const registry = new this.props.web3.eth.Contract(
            OfferRegistry.abi,
            this.state.registry
        );

        
        const sells = await this.loadSells(registry)
        const buys = await this.loadBuys(registry)

        await this.prepareData(sells, buys)
        

        //Ready
        this.setState({
            ready: true
        })        
        
    }

    async cancel(contract_addr) {
        console.log("cancel contract: ", contract_addr)
        const contract = new this.props.web3.eth.Contract(Offer.abi, contract_addr);
        await contract.methods.cancel().send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Cancelar oferta");

            this.load();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Cancelar oferta");
        })
    }

    async rejectBuyer(contract_addr) {
        console.log("rejectBuyer contract: ", contract_addr)
        const contract = new this.props.web3.eth.Contract(Offer.abi, contract_addr);
        await contract.methods.rejectBuyer().send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Rechazar comprador");

            this.load();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Rechazar comprador");
        })
    }

    async confirm(contract_addr) {
        console.log("confirm contract: ", contract_addr)
        const contract = new this.props.web3.eth.Contract(Offer.abi, contract_addr);
        await contract.methods.confirm().send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Confirmar oferta");

            this.load();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Confirmar oferta");
        })
    }

    async getContactInfo(contract_addr) {
        console.log("getContactInfo contract: ", contract_addr)
        const contract = new this.props.web3.eth.Contract(Offer.abi, contract_addr);

        const contactInfo = Web3.utils.hexToUtf8(await contract.methods.getContactInfo().call());
        console.log("response contactInfo: ", contactInfo);

        //Popup
        this.setState({
            showContact: true,
            contactInfo: contactInfo
        })
    }

    async withdraw(contract_addr) {
        console.log("withdraw contract: ", contract_addr)
        const contract = new this.props.web3.eth.Contract(Offer.abi, contract_addr);
        await contract.methods.withdraw().send({from: this.state.account})
        .then((response) => {
            //Success notification
            NotificationManager.success("Acción realizada con éxito.", "Retiro de fondos");

            this.load();
        })
        .catch((ex) => {
            //Error notification
            NotificationManager.error("Ha surgido un error durante su ejecución.", "Retiro de fondos");
        })
    }

    edit(contract_addr) {
        this.setState({
            edit: true,
            selected_edit: contract_addr
        })
    }

    closeEdit() {
        this.setState( {
            edit: false,
            selected_edit: null
        })
    }

    coseContactInfo() {
        this.setState({
            showContact: false
        })
    }

    render() {
        return(


            <div className="all-offers-background ">
                <div className="all-offers-non-background">
                
                {this.state.edit && this.state.selected_edit != null ?
                    <Edit account={this.state.account} close={this.closeEdit} contract={this.state.selected_edit} reload={this.load} ipfs={this.props.ipfs} web3={this.props.web3}/>
                    :null
                }   

                {this.state.showContact && this.state.contactInfo !== "" ?
                    <PopupContactInfo contactInfo={this.state.contactInfo} close={this.coseContactInfo}/>
                    :null
                }
                    
                {!this.state.ready ?
                        <div>
                            <h3>Loading...</h3>
                        </div>
                        :(
                            <div className="offers_popup_content"> 
                                <div className="offersHeader">
                                    <div className="offersTitle">
                                        <h3>Tus compras y ventas</h3>
                                    </div>

                                    <div className="offersGoBack">
                                        <Link to={'/'}>
                                            <button className="goBack-btn">Volver atrás</button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="offers_items_wrapper">
                                {
                                    this.state.offers.map((offer) => (
                                        <div className="offers_item" key={offer.contract_addr}>
                                            
                                            <img className="offers_img" src={offer.img} alt=""></img>
                                            <div className="offer_data">
                                                <div className="flex offer_first_line">
                                                    <p className="offer_first_tit">{offer.title}</p>
                                                    <p>{offer.price} Eth</p>
                                                </div>
                                                <div className="offers_state">
                                                    <p>{offer.type}: {offer.stateTranslation}</p>
                                                </div>
                                            </div>
                                            <div className="offers_actions">
                                                {offer.type === "Venta" && (offer.state === "0" || offer.state === "1") ?                                                
                                                    <button className="offers_btns" onClick={() => {this.cancel(offer.contract_addr)}}>Cancelar</button>
                                                    :null
                                                }
                                               
                                                {offer.type === "Venta" && offer.state === "0" ?                                                
                                                    <button className="offers_btns" onClick={() => {this.edit(offer.contract_addr)}}>Editar</button>
                                                    :null
                                                }

                                                {offer.type === "Venta" && offer.state === "1" ?                                                
                                                    <button className="offers_btns" onClick={() => {this.rejectBuyer(offer.contract_addr)}}>Rechazar comprador</button>
                                                    :null
                                                }

                                                {offer.type === "Compra" &&  offer.state === "1" ?                                                
                                                    <button className="offers_btns" onClick={() => {this.confirm(offer.contract_addr)}}>Confirmar</button>
                                                    :null
                                                }

                                                {offer.state === "1" ?                                                
                                                    <button className="offers_btns" onClick={() => {this.getContactInfo(offer.contract_addr)}}>Contacto</button>
                                                    :null
                                                }

                                                {offer.pendingWithdrawals > 0 ?                                                
                                                    <button className="offers_btns" onClick={() => {this.withdraw(offer.contract_addr)}}>Retirar fondos</button>
                                                    :null
                                                }                                               

                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                           
                        )
                    }

                </div>
            </div>
        )
    }
}

export default ViewAllOffers;