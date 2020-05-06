import React, { Component } from "react";

import { IpfsConnection } from "wb-ipfs";

import Popup from "./Popup";

import "./styles/MyCard.css";

class MyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      offer: null,
      imgs: [],
      ipfs: new IpfsConnection("http://79.147.40.189:3000"),
    };

    this.initImgs();
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
    if (this.state.offer != null) {
      this.setState({
        offer: null,
      });
    }
  }

  cardClicked(data) {
    this.togglePopup();

    this.setState({
      offer: data,
    });
  }

  async initImgs() {
    this.setState({
      imgs: await this.state.ipfs.getAllImagesUrl(this.props.data.cid),
    });
  }

  render() {
    return (
      <div>
        {this.state.showPopup ? (
          <Popup
            offer={this.state.offer}
            closePopup={this.togglePopup.bind(this)}
            imgs={this.state.imgs}
          />
        ) : null}

        <div
          className="result-item"
          key={this.props.data.offer}
          onClick={this.cardClicked.bind(this, this.props.data)}
        >
          <img className="card-img" src={this.state.imgs[0]} />
          <div className="flex column card-info">
            <div className="card-info-price">{this.props.data.price} Eth</div>

            <div className="card-info-title">{this.props.data.title}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyCard;
