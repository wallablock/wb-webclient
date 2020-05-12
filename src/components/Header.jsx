import React, { Component } from "react";

import SearchFilters from "./SearchFilters";

import { Link } from "react-router-dom";

import "./styles/Header.css";

import OfferRegistry from "wb-contracts/build/contracts/OfferRegistry.json"; //"../contracts/Offer.json"
import Web3 from "web3";
const myweb3 = new Web3(window.ethereum);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };



  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  async deploy() {
    const accounts = await window.ethereum.enable();
    const account = accounts[0]

    console.log("account: ", account)

    let myOfferRegistry = new myweb3.eth.Contract(OfferRegistry.abi, {
      from: account
    });

    await myOfferRegistry.deploy({
      data: OfferRegistry.bytecode,
    })
    .send()
    .then((response) => {
      console.log("response: ", response)
    })

    console.log("deployed")


  }



  render() {
    return (
      
      <nav className="mynavbar">
        <div className="mytitle">WallaBlock</div>

        <div className=" bts_content">
          <div className="bts_wrap">
              <input
                type="button"
                className="mybutton"
                value="Ver tus ventas/compras"
                onClick={this.props.open}
              />
          </div>
          <div className="bts_wrap">
            <Link to="/publish">
              <input
                type="button"
                className="  mybutton"
                value="Publicar oferta"
              />
            </Link>
          </div>



          <Link to="/alloffers/">
            <button>Go to page</button>
          </Link>

          {
          /*
          <button onClick={this.deploy}>Deploy registry</button>
          */
          }

        </div>

        <SearchFilters {...this.props} visible={this.state.visible} />
      </nav>
    );
  }
}

export default Header;


/**
 <div className="flex row-reverse bts_content">
          <div className="bts_wrap">
            <Link to="/publish">
              <input
                type="button"
                className="button button1"
                value="Publicar oferta"
              />
            </Link>
          </div>
          <div className="bts_wrap">
            <Link to="/generate">
              <input
                type="button"
                className="button button1"
                value="Generar cuenta"
              />
            </Link>
          </div>
        </div>
 */