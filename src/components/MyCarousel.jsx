import React, { Component } from "react";

import Carousel from "react-bootstrap/Carousel";

import "./styles/MyCarousel.css";

class MyCarousel extends Component {
  myCarouselItem() {}

  render() {
    return (
      <Carousel interval={null}>
        {this.props.imgs.map((img) => (
          <Carousel.Item key={img}>
            <img className="my-carousel " src={img} />
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }
}

export default MyCarousel;
