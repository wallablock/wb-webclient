import React, { Component } from "react";

import Carousel from 'react-bootstrap/Carousel';


class MyCarousel extends Component {

    myCarouselItem() {

    }

    render() {
        return (

            <Carousel
                interval={null}    
            >

                {this.props.imgs.map(img => (
                    <Carousel.Item
                        key={img}
                    >
                        <img
                            className="my-carousel "
                            src={img}
                        />

                    </Carousel.Item>
                ))}



                </Carousel>

        );
    }
}


/*
                    <Carousel.Item>
                        <img
                                                className="my-carousel "
                        src="http://79.147.40.189:8080/ipfs/QmNx3EabzNqfpWqiTTsJA7VGwPgkEhWJyxFc2Tj67QXfPm"
                        alt="First slide"

                        />
   
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                                                className="my-carousel "

                        src= "http://79.147.40.189:8080/ipfs/QmSk8pUahbnAHoEwdY3kkoCwnYbDcTt8nf21G89pWBswp9"
                        alt="Second slide"
                        />

                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                                                className="my-carousel "

                        src="http://79.147.40.189:8080/ipfs/QmNrnUY9Fn9B3egTUHDdHQL366xfaPPXiD5KJ78EDRQdSZ"
                        alt="Third slide"
                        />

                    </Carousel.Item>
                    */




export default MyCarousel;