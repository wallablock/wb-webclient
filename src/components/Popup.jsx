import React from 'react';
import '../App.css';
import ImageReader from './ImageReader';

import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

import MyCarousel from './MyCarousel';


import {
    Link
} from "react-router-dom";


class Popup extends React.Component {
    constructor(props) {
        super(props);

        let tmp_imgs = this.prepareImgs(this.props.imgs);


        this.state = {
            imgs: tmp_imgs
        };



        console.log("after for en this.prepareImgs()");
        console.log(this.state.imgs)
    }

    prepareImgs(imgs) {
        let newImgs = [];
        for (let i = 0; i < imgs.length; i++) {
            newImgs.push({ "source": imgs[i] })
        }

        return newImgs;
    }


    render() {
        const images = [
            { url: "anuncios/ip9.jpg" },
            { url: "anuncios/ip92.jpg" },
            { url: "anuncios/ip93.jpg" },
            { url: "anuncios/ip94.jpeg" },
            { url: "anuncios/ip96.jpeg" },
            { url: "anuncios/ip97.jpg" },
        ];

        const slideImages = [
            'images/slide_2.jpg',
            'images/slide_3.jpg',
            'images/slide_4.jpg'
        ];

        return (
            <div className='popup_background' onClick={this.props.closePopup}>
                <div className='popup' onClick={(e) => { e.stopPropagation(); }}>

                    <MyCarousel
                        imgs={this.props.imgs}
                    />

                    <h2>{this.props.offer.title}</h2>
                    <h2>{this.props.offer.price}</h2>



                    <Link to="/publish">
                        <input type="button" className="button button1" value="Comprar" />
                    </Link>

                </div>
            </div>
        );
    }
}

export default Popup;
