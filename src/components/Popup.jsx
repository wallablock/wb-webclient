import React from "react";
import "./styles/Popup.css";

import MyCarousel from "./MyCarousel";

import { Link } from "react-router-dom";

class Popup extends React.Component {
  constructor(props) {
    super(props);

    let tmp_imgs = this.prepareImgs(this.props.imgs);

    this.state = {
      imgs: tmp_imgs,
    };

  }

  prepareImgs(imgs) {
    let newImgs = [];
    for (let i = 0; i < imgs.length; i++) {
      newImgs.push({ source: imgs[i] });
    }

    return newImgs;
  }

  render() {
    return (
      <div className="popup_background" onClick={this.props.closePopup}>
        <div
          className="popup"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MyCarousel imgs={this.props.imgs} />

          <div className="popup-data">
            <h2>{this.props.offer.title}</h2>
            <h2>{this.props.offer.price} Eths</h2>
            <p className="popup-descr">{this.props.desc}</p>
          </div>

          <div className="buy-btn-wrap">
            <Link to={`/offer/${this.props.offer.offer}`}>
              <input type="button" className="button button1 buy-btn" value="Comprar" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
