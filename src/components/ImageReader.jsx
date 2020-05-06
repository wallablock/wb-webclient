import React, { Component } from "react";
import ipfs from 'wb-ipfs';

class ImageReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.getImages();
  }

  async getImages() {
    const ipfsConnection = new ipfs.IpfsConnection("http://79.147.40.189:3000");
    console.log("getImages, ipfsconn");
    console.log(ipfsConnection);

    const hash = "QmV8PNhNpvxQt89YVihxgU1mVdMbqLyrVYBXD5hheQd4v5";
    //const hash = this.props.cid;

    let links;
    try {
      let cover_link = await ipfsConnection.coverUrl(hash);
      console.log("IN try, cover link");
      console.log(cover_link);

      links = await ipfsConnection.getAllImagesUrl(hash);
      console.log("IN try, links");
      console.log(links);

      const desc = await ipfsConnection.fetchDesc(hash);
      console.log("IN try, desc");
      console.log(desc);
    } catch (err) {
      console.error("Error from IPFS.read:", err);
    }

    console.log("getImages");
    console.log(links);

    for (let item of links) {
      this.setState({
        //data: this.state.data.concat(item)
        data: item,
      });
    }
  }

  render() {
    return <div>{this.state.data ? <img src={this.state.data} /> : null}</div>;
  }
}

export default ImageReader;
