import React, {Component} from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

import "./styles/Popup2.css";

class Popup2 extends Component {

    truncDescription(descr) {
        if (descr === null || descr === "") return "";
        if (descr.length > 300) {
            const trunc = descr.substring(0,300) + "...";
            return trunc;
        }
        return descr;
    }

    render() {
        return(
            <div className="popup2-background" onClick={this.props.closePopup}>
                <div className="popup2-content" onClick={(e) => {e.stopPropagation();}}>
                    <div className="popup2-carousel">
                        {this.props.imgs.length > 0 ?
                            <Carousel interval={null}>
                                {this.props.imgs.map((img) => (
                                <Carousel.Item key={img}>
                                    <img className="popup2-carouse-img" src={img} alt=""/>
                                </Carousel.Item>
                                ))}
                            </Carousel>
                            :null
                        }
                    </div>

                    <div className="popup2-under ">
                        <div className="popup2-data">
                            <p className="popup2-title">{this.props.offer.title}</p>
                            <p className="popup2-price">{this.props.offer.price} Eths</p>
                            <div className="popup2-description">
                                <p>{this.truncDescription(this.props.desc)}</p>

                            </div>
                        </div>

                        <div className="popup2-btn"> 
                            <Link to={`/buy/${this.props.offer.offer}`}>
                                <input type="button" className="button button1 popup2-buy-btn" value="Comprar" />
                            </Link>
                        </div>
                    </div>
                    

                </div>
            </div>
        );
    }
}

export default Popup2;
