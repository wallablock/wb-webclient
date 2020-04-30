import React, { Component } from 'react';

var ipfs = require('wb-ipfs');


async function getImages(hash) {
    const ipfsConnection = new ipfs.IpfsConnection("79.147.40.189");
    //const hash = "QmcxAke8tG6cNJiZCqQoZvTE2yDoJu95VJ9KSQKYdkgcCm";
   // const hash = this.props.cid;

    let links;
    try {
        links = await ipfsConnection.read(hash);
        //console.log(links)
        return links;
    } catch (err) {
        console.error("Error from IPFS.read:", err);
        return null;
    }
}

export default getImages;