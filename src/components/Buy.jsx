import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyCarousel from "./MyCarousel";

import "./styles/Buy.css";


class Buy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactInfo: ""
        }
        this.handleContact = this.handleContact.bind(this)
    }

    handleContact(e) {
        this.setState({
            contactInfo: e.target.value
        })
    }

    render () {
        return (
            <div>
                <div className="buy-title-price">
                    <div className="buy-title">
                        <h2>{this.props.title}</h2>
                    </div>
                    <div className="buy-price">
                        <h2>{this.props.price} Eths</h2>
                    </div>
                </div>

                <div className="buy-carousel">
                    <MyCarousel imgs={this.props.imgs}/>
                </div>

                <div className="buy-catg-ships">
                    <div className="buy-catg">
                        <p>Categoría: {this.props.category}</p>
                    </div>
                    <div className="buy-ships">
                        <p>País de origen: {this.props.country}</p>
                    </div>
                </div>

                <div className="buy-descr">
                    <p>Descripción: {this.props.desc}</p>
                </div>

                <div className="buy-contact-butn">

                    <div className="flex buy-contact-wrap">
                        <p className="buy-contact-label">Correo de contacto: </p>

                        <div className="buy-contact">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Enter email" onChange={this.handleContact} required/>
                            </Form.Group>
                        </div>
                    </div>

                    <div className="buy-butn-wrap">
                        <button 
                            className="buy-butn" 
                            onClick={() => {
                                this.props.buy(this.state.contactInfo)
                            }}
                        >
                            Comprar
                        </button>
                    </div>
                </div>



            </div>
        );
    }
}

/*
                <div className="buy-contact-butn">

                    <div className="flex buy-contact-wrap">
                        <p className="buy-contact-label">Correo de contacto: </p>

                        <div className="buy-contact">

                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                        </div>
                    </div>

                    <div className="buy-butn">
                        <Button>Comprar</Button>
                    </div>

         

                </div>
*/

export default Buy;