import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormFile from 'react-bootstrap/FormFile';
import Feedback from 'react-bootstrap/Feedback';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



import './styles/PublishStyle.css';

import ImageUploader from './ImageUploader';


import { getCode, getNames, getNameList } from 'country-list';


class PublishComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: 'a'
        }
    }

    suu (event) {
        console.log("arriba")
        this.setState({
            test: 'b'
        })
    }

    render() {
        return (

           <div className='background'>
                <div className='non-background'>
                <div className='content'>


                    <Form.Group controlId="formBasicEmail">
                        <Row>
                            <Col>
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" placeholder="Escribe un título para la oferta." />
                            </Col>
                            <Col>
                                 <Form.Label>Precio</Form.Label>
                                <Form.Control type="text" placeholder="Precio en Ethers" />
                            </Col>
                        </Row>



                    </Form.Group>


                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows="3" placeholder="Descripción del producto"/>
                    </Form.Group>


                    <Form.Group controlId="formGridState">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control as="select">
                            <option></option>
                            <option>TVs</option>
                            <option>Electrodomésticos</option>
                            <option>Móviles</option>
                            <option>Vehículos</option>
                            <option>Motos</option>
                            <option>Inmobiliaria</option>
                        </Form.Control>
                    </Form.Group>





                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>País de origen</Form.Label>
                        <Form.Control as="select" placeholder="">
                            <option></option>
                            {(getNames()).map(country => (
                                <option>{country}</option>
                            ))}

                        </Form.Control>
                    </Form.Group>


                    <ImageUploader />


                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="     Acepto y comprendo los terminos de uso." />
                    </Form.Group>


                    <Button type="submit" onClick={this.suu}>Submit form</Button>

                </div>

                </div>
            </div>

        );
    }
}

export default PublishComponent;
