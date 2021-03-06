import React, { Component } from "react";
//import Popup from "./Popup";
import Popup2 from "./Popup2";

import "./styles/MyCard.css";

class MyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      offer: null,
      imgs: [],
      desc: "",
      rdy: false
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

  estado() {
    this.setState({
      rdy: true
    })
  }

  async initImgs() {
    let imgs;
    let desc;
      //let imgs;
      if (this.props.data.cid !== "") {
        imgs = await this.props.ipfs.getAllImagesUrl(this.props.data.attachedFiles)
        desc = await this.props.ipfs.fetchDesc(this.props.data.attachedFiles)
        this.setState({
          imgs: imgs,
          desc: desc,
        })
      }    
  }

  countDecimals(num) {
    if(Math.floor(num) === num) return 0;
    const num_s = num.toString();
    const arr = num_s.split("-");
    return parseInt(arr[1]);
  }

  cientificNotation(num) {
    return num.toString().includes("e");
  }

  removeCientificNotation(num) {
    if (num < 1 && this.cientificNotation(num)) {
      const countDecimals = this.countDecimals(num);
      
      return Number.parseFloat(num).toFixed(countDecimals)
    }
    else return num;
  }

  render() {
    return (
      <div>

        {this.state.showPopup ? 
          (
         /* <Popup
            closePopup={this.togglePopup.bind(this)}
            offer={this.state.offer}
            imgs={this.state.imgs}
            desc={this.state.desc}
          />*/
          <Popup2
            closePopup={this.togglePopup.bind(this)}
            offer={this.state.offer}
            imgs={this.state.imgs}
            desc={this.state.desc}
          />
          ) 
          :null
        }

          <div
          className="result-card"
          key={this.props.data.offer}
          onClick={this.cardClicked.bind(this, this.props.data)}
          >
            <img className="card-img" src={this.state.imgs[0]} alt=""/>
            <div className="flex column card-info">
              {/*
                          <div className="card-info-price">{this.removeCientificNotation(this.props.data.price)} Eth</div>

              */}

              <div className="card-info-price">{this.props.data.price} Eth</div>

              <div className="card-info-title">{this.props.data.title}</div>
            </div>
          </div>

      </div>
    );
  }
}

export default MyCard;
