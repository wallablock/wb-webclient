import React from 'react';  
import '../App.css';  
import ImageReader from './ImageReader';

//import Carousel, { Dots } from '@brainhubeu/react-carousel';
//import '@brainhubeu/react-carousel/lib/style.css';

//import SimpleImageSlider from "react-simple-image-slider";

//import { Slide } from 'react-slideshow-image';


import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
//import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
//import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
//import AwsSliderStyles from 'react-awesome-slider/src/core/styles.scss';
//import AwsSliderStyles from '/home/mark/github/wallablock/wb-webclient/node_modules/react-awesome-slider/src/styled/fall-animation/cube-animation.scss';


import {
	Link
} from "react-router-dom";


class Popup extends React.Component {  


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
                <div className='popup' onClick={(e) => {e.stopPropagation();}}>  
                    


                <AwesomeSlider 
                 
                    slider-transition-duration={200}
                    
                >
                    <div data-src="anuncios/ip96.jpeg" />
                    <div data-src="anuncios/ip9.jpg"/>
                    <div data-src="anuncios/ip92.jpg" />
                    <div data-src="anuncios/ip93.jpg" />
                    <div data-src="anuncios/ip94.jpeg" />
                    <div data-src="anuncios/ip97.jpg" />

                </AwesomeSlider>



                    <h2>{this.props.offer.title}</h2>
                    <h2>{this.props.offer.price}</h2>

                    <Link to="/publish">
							<input type="button" className="button button1" value="Comprar"/>
					</Link>

                </div>  
            </div>  
        );  
    }  
}  

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