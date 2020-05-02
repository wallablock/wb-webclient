
import ipfs from "wb-ipfs";


async function getImages(hash) {
    const ipfsConnection = new ipfs.IpfsConnection("79.147.40.189");

    let links;
    try {
        links = await ipfsConnection.read(hash);
        return links;
    } catch (err) {
        console.error("Error from IPFS.read:", err);
        return null;
    }
}

export default getImages;
