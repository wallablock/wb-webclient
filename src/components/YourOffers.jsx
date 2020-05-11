import React, {Component} from "react";
import "./styles/YourOffers.css";

import { IpfsConnection } from "wb-ipfs";

import Offer from "wb-contracts/build/contracts/Offer.json"; //"../contracts/Offer.json"
import OfferRegistry from "wb-contracts/build/contracts/OfferRegistry.json"; //"../contracts/Offer.json"
import Web3 from "web3";
const myweb3 = new Web3(window.ethereum);

class YourOffers extends Component {
    constructor(props) {
        super(props);

        console.log("constructor your offers")

        this.state = {
            ready: false,
            registry: "0x6c4ea8aFFa12C061e5508Bd79fD616F10E6ce625",
            account: "",
            ipfs: new IpfsConnection("http://79.147.40.189:3000"),
            offers: []
        }
        this.load = this.load.bind(this)

        this.load();
    }

    async getAccount() {
        const accounts = await window.ethereum.enable();
    
        this.setState({
          account: accounts[0],
        });
    }

    async loadBuys(registry) {
        console.log("load buys, account to filer: ", this.state.account)

        const buy_events = await registry.getPastEvents('Bought', {
            filter: {buyer: this.state.account},
            fromBlock: 0
        }/*, function(error, events) {console.log(events)}*/)
        /*.then(function(events) {   
            for (let i= 0; i < events.length; i++) {
                boughts.push(events[i].returnValues.offer)
            }            
        });*/

        console.log("buy_events: ", buy_events)

        let buys = []
        for (let i= 0; i < buy_events.length; i++) {
            buys.push(buy_events[i].returnValues.offer)
        }

        return buys
    }

    async loadSells(registry) {
        console.log("load sells, account to filer: ", this.state.account)

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

        console.log("sell_events: ", sell_events)

        let sells = []
        for (let i= 0; i < sell_events.length; i++) {
            sells.push(sell_events[i].returnValues.offer)
        }

        return sells
    }

    async prepareData(sells, buys) {
        //Sells
        console.log("prepareData, sells.length: ", sells.length)
        let sells_offer = []
        for (let i = 0; i < sells.length; i++) {
            console.log("contract addr: ", sells[i])
            const contract = new myweb3.eth.Contract(Offer.abi, sells[i]);
            const offer = {
                contract_addr: sells[i],
                type: "Venta",
                title: await contract.methods.title().call(),
                price: Web3.utils.fromWei(await contract.methods.price().call()),
                state: await contract.methods.currentStatus().call(),
                pendingWithdrawals: await contract.methods.pendingWithdrawals(this.state.account).call(),
                img: this.state.ipfs.coverUrl(await contract.methods.attachedFiles().call())
            } 
            console.log("contract: ", contract)
            console.log("offer: ", offer)

            sells_offer.push(offer)
        }

        this.setState({
            offers: this.state.offers.concat(sells_offer)
        })

        //Buys
        console.log("prepareData, buys.length: ", buys.length)
        let buys_offer = []
        for (let i = 0; i < buys.length; i++) {
            console.log("contract addr: ", buys[i])
            const contract = new myweb3.eth.Contract(Offer.abi, buys[i]);
            const offer = {
                contract_addr: buys[i],
                type: "Compra",
                title: await contract.methods.title().call(),
                price: Web3.utils.fromWei(await contract.methods.price().call()),
                state: await contract.methods.currentStatus().call(),
                pendingWithdrawals: await contract.methods.pendingWithdrawals(this.state.account).call(),
                img: this.state.ipfs.coverUrl(await contract.methods.attachedFiles().call())
            } 
            console.log("contract: ", contract)
            console.log("offer: ", offer)

            buys_offer.push(offer)
        }

        this.setState({
            offers: this.state.offers.concat(buys_offer)
        })
    }

    async load() {
        await this.getAccount();


        const registry = new myweb3.eth.Contract(
            OfferRegistry.abi,
            this.state.registry
        );

        
        const sells = await this.loadSells(registry)
        console.log("loadSells ha tornat, sells: ", sells)


        const buys = await this.loadBuys(registry)
        console.log("loadBuys ha tornat, buys: ", buys)

        await this.prepareData(sells, buys)

        

        //Ready
        this.setState({
            ready: true
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
                    {!this.state.ready ?
                        <div>
                            <h3>Loading...</h3>
                        </div>
                        :(
                            <div className="offers_popup_content"> 
                                <div className="offersTitle">
                                    <h3>Tus compras y ventas</h3>
                                </div>

                                <div className="offers_items_wrapper">
                                {
                                    this.state.offers.map((offer) => (
                                        <div className="offers_item" key={offer}>
                                            
                                            <img className="offers_img" src={offer.img}></img>
                                            <div className="offer_data">
                                                <div className="flex offer_first_line">
                                                    <p className="offer_first_tit">{offer.title}</p>
                                                    <p>{offer.price} Eth</p>
                                                </div>
                                                <div>
                                                    {offer.type}
                                                </div>
                                            </div>
                                            <div className="offers_actions">
                                                {offer.type === "Venta" && (offer.state === "0" || offer.state === "1") ?                                                
                                                    <button className="offers_btns">Cancel</button>
                                                    :null
                                                }
                                               
                                                {offer.type === "Venta" && offer.state === "0" ?                                                
                                                    <button className="offers_btns">Edit</button>
                                                    :null
                                                }

                                                {offer.type === "Venta" && offer.state === "1" ?                                                
                                                    <button className="offers_btns">RejectBuyer</button>
                                                    :null
                                                }

                                                {offer.type === "Compra" &&  offer.state === "1" ?                                                
                                                    <button className="offers_btns">Confirm</button>
                                                    :null
                                                }

                                                {offer.state === "1" ?                                                
                                                    <button className="offers_btns">getCotactInfo</button>
                                                    :null
                                                }

                                                {offer.pendingWithdrawals > 0 ?                                                
                                                    <button className="offers_btns">Withdraw</button>
                                                    :null
                                                }

                                               {
                                               /* 
                                               <button>RejectBuyer</button>
                                                <button>Confirm</button>
                                                <button>GetContactInfo</button>
                                                <button>Cancel</button>
                                                <button>Edit</button>
                                                */
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

export default YourOffers;