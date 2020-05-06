import React from 'react';
import '../App.css';
import ImageReader from './ImageReader';

//import Carousel, { Dots } from '@brainhubeu/react-carousel';
//import '@brainhubeu/react-carousel/lib/style.css';

//import SimpleImageSlider from "react-simple-image-slider";

//import { Slide } from 'react-slideshow-image';



//import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
//import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
//import AwsSliderStyles from 'react-awesome-slider/src/core/styles.scss';
//import AwsSliderStyles from '/home/mark/github/wallablock/wb-webclient/node_modules/react-awesome-slider/src/styled/fall-animation/cube-animation.scss';


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

        /*this.setState({
            imgs: {newImgs}
        })*/
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


          /*

        let myImages={[
            {
              source: "http://79.147.40.189:8080/ipfs/QmNx3EabzNqfpWqiTTsJA7VGwPgkEhWJyxFc2Tj67QXfPm",
            },
            {
              source: "http://79.147.40.189:8080/ipfs/QmSk8pUahbnAHoEwdY3kkoCwnYbDcTt8nf21G89pWBswp9",
            },
            {
              source: "http://79.147.40.189:8080/ipfs/QmNrnUY9Fn9B3egTUHDdHQL366xfaPPXiD5KJ78EDRQdSZ"
            }
          ]}
*/



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

/*


   <AwesomeSlider>
                   <div data-src= "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_AA.svg/1200px-Logo_AA.svg.png" />
                   <div data-src= "https://www.theaa.com/Assets/images/logo.png"/>
                   <div data-src= "https://camo.githubusercontent.com/56ffb884b55ecfae37e4e2d14c91e43a54a364e4/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f652f65382f496e7465726e6174696f6e616c5f496d6167655f496e7465726f7065726162696c6974795f4672616d65776f726b5f6c6f676f2e706e67.png"/>

                   


               </AwesomeSlider>


*/


/*

    <AwesomeSlider
                    media={[
                    {
                        source:  "http://79.147.40.189:8080/ipfs/QmNx3EabzNqfpWqiTTsJA7VGwPgkEhWJyxFc2Tj67QXfPm",
                    },
                    {
                        source: "http://79.147.40.189:8080/ipfs/QmSk8pUahbnAHoEwdY3kkoCwnYbDcTt8nf21G89pWBswp9",
                    },
                    {
                        source: "http://79.147.40.189:8080/ipfs/QmNrnUY9Fn9B3egTUHDdHQL366xfaPPXiD5KJ78EDRQdSZ",
                    },
                    ]}
                />


*/

/*
                    <AwesomeSlider
                        media={this.state.imgs}
                        slider-transition-duration={200}

                    />
*/


/*
               <AwesomeSlider
                   <div data-src="anuncios/ip96.jpeg" />
                   <div data-src="anuncios/ip9.jpg"/>
                   <div data-src="anuncios/ip92.jpg" />
                   <div data-src="anuncios/ip93.jpg" />
                   <div data-src="anuncios/ip94.jpeg" />
                   <div data-src="anuncios/ip97.jpg" />

               </AwesomeSlider>

            */


//                    <ImageReader cid={this.props.offer.cid}/>


/*
               <SimpleImageSlider
                       width={927}
                       height={504}
                       images={images}
                       slideDuration={0.3}
                   />
               */


//                    <ImageReader />


//                    <button onClick={this.props.closePopup}>close me</button>  


export default Popup;