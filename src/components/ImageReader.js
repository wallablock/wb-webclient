import React, { Component } from 'react';
//import ipfs from 'wb-ipfs';
var ipfs = require('wb-ipfs');


class ImageReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }


    async getImages() {
        const ipfsConnection = new ipfs.IpfsConnection("79.147.40.189");
        const hash = "QmcxAke8tG6cNJiZCqQoZvTE2yDoJu95VJ9KSQKYdkgcCm";
        let links;
        try {
            links = await ipfsConnection.read(hash);
        } catch (err) {
            console.error("Error from IPFS.read:", err);
        }

        for (let item of links) {
            this.setState({
                //data: this.state.data.concat(item)
                data: item
            })
        }

    }

    render() {
       this.getImages();


        //console.log("vals")
        //console.log(values)

        return (
            <div>
                <button>eso diseee</button>
                

                {this.state.data ?
				     <img src={this.state.data} />
					:null
				}


            </div>
        );
    }
}

export default ImageReader;