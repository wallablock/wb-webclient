import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import MyCarousel from "./MyCarousel";
import { Link } from "react-router-dom";

import "./styles/Buy.css";


class Buy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactInfo: ""
        }
        this.handleContact = this.handleContact.bind(this);
        this.reset = this.reset.bind(this);
    }

    handleContact(e) {
        this.setState({
            contactInfo: e.target.value
        })
    }

    reset() {
        this.setState({
            contactInfo: ""
        })

        this.props.revertReset();
    }

    truncDescription(descr) {
        if (descr === null || descr === "") return "";
        if (descr.length > 560) {
            const trunc = descr.substring(0,560) + "...";
            return trunc;
        }
        return descr;
    }

    render () {
        return (
            <div className="buy-container">
                {this.props.reset ?
                    this.reset()
                    :null
                }
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
                    <p> Descripción: {this.truncDescription(this.props.desc)}</p>
                </div>

                <Form onSubmit={(e) => {
                    e.preventDefault();

                    this.props.buy(this.state.contactInfo)
                    }}>

                <div className="buy-contact-butn">

                    <div className="flex buy-contact-wrap">
                        <p className="buy-contact-label">Correo de contacto: </p>

                        <div className="buy-contact">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Enter email" onChange={this.handleContact} value={this.state.contactInfo} required/>
                            </Form.Group>
                        </div>
                    </div>

                    <div className="buy-butn-wrap">
                        <div>
                            <button 
                                className="buy-butn" 
                                type="submit"
                                disabled={this.props.seller === this.props.account || this.props.state !== "0"}
                                /*onClick={() => {
                                    this.props.buy(this.state.contactInfo)
                                }}*/
                            >
                                Comprar
                            </button>
                        </div>
                        
                        <div className="buy-cancel-buton-wrap">
                        <Link to={'/'}>
                            <button className="buy-cancel-butn">Volver</button>
                        </Link>
                        </div>
                    </div>

                </div>
                </Form>



            </div>
        );
    }
}

/*


                <Form onSubmit={this.props.buy(this.state.contactInfo)}>

                <div className="buy-contact-butn">

                    <div className="flex buy-contact-wrap">
                        <p className="buy-contact-label">Correo de contacto: </p>

                        <div className="buy-contact">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>test</Form.Label>

                                <Form.Control type="email" placeholder="Enter email" onChange={this.handleContact} value={this.state.contactInfo} required/>
                            </Form.Group>
                        </div>
                    </div>

                    <div className="buy-butn-wrap">
                        <div>
                            <button 
                                className="buy-butn" 
                                type="submit"
                                onClick={() => {
                                    this.props.buy(this.state.contactInfo)
                                }}
                                >
                                Comprar
                            </button>
                        </div>
                        
                        <div className="buy-cancel-buton-wrap">
                        <Link to={'/'}>
                            <button className="buy-cancel-butn">Volver</button>
                        </Link>
                        </div>
                    </div>

                </div>
                </Form>


*/

export default Buy;