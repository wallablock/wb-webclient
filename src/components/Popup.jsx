import React from 'react';
import '../App.css';

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
