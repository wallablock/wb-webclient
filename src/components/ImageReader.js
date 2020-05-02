import React, { Component } from 'react';
var ipfs = require('wb-ipfs');


class ImageReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
               this.getImages();

    }


    async getImages() {
        const ipfsConnection = new ipfs.IpfsConnection("79.147.40.189");
        const hash = this.props.cid;

        let links;
        try {
            links = await ipfsConnection.read(hash);
        } catch (err) {
            console.error("Error from IPFS.read:", err);
        }

        console.log("getImages")
        console.log(links)

        for (let item of links) {
            this.setState({
                data: item
            })
        }

    }

    render() {

        return (
            <div>


                {this.state.data ?
				     <img src={this.state.data} />
					:null
				}


            </div>
        );
    }
}

export default ImageReader;
