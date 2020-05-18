import React from "react";
import "./styles/Popup.css";

import MyCarousel from "./MyCarousel";

import { Link } from "react-router-dom";

class Popup extends React.Component {
 /* constructor(props) {
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
  }*/

  render() {
    return (
      <div className="popup_background" onClick={this.props.closePopup}>
        <div
          className="popup"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="popup-carousel">
            {this.props.imgs.length > 0 ?
              <MyCarousel imgs={this.props.imgs} />
              :null
            }
          </div>

          <div className="popup-data">
            <p className="popup-title">{this.props.offer.title}</p>
            <p className="popup-price">{this.props.offer.price} Eths</p>
            <div className="popup-descrasao">
              <p >{this.props.desc}</p>

            </div>
          </div>

          <div className="buy-btn-wrap">
            <Link to={`/buy/${this.props.offer.offer}`}>
              <input type="button" className="button button1 buy-btn" value="Comprar" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
