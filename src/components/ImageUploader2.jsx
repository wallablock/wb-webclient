import React, { Component } from "react";
import Form from "react-bootstrap/Form";

//TESTING
import { IpfsConnection } from "wb-ipfs";


class ImageUploader2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],

        };

        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);

        this.test();
    }

    extractName(url) {
        const index = url.lastIndexOf('/')
        const name = url.substring(index + 1, url.length)
        return name
    }

    async test() {
        if (this.props.cid != null) { //CHECKEAR q quan no hi hagi cid predefinid, passam un cid amb null.
            //Init ipfs
            const myIpfs = new IpfsConnection("http://79.159.98.192:3000");



            const imgs = await myIpfs.getAllImagesUrl(this.props.cid);

            let files = []
    
            //Init files with IPFS images
            for (let i = 0; i < imgs.length; i++) {
                const name = this.extractName(imgs[i])
    
                const file = await fetch(imgs[i])
                .then(r => r.blob())
                .then(blobFile => new File([blobFile], name, { type: blobFile.type }))
    
                files.push(file)
            }
    
            this.setState({
                files: files
            })
    
            this.props.onChange(files);
        }
        
    }

    removeImage(img) {
        var array = [...this.state.files];
        console.log(array);
        var index = array.indexOf(img);
        console.log(index);
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({ files: array });
        }

        this.props.onChange(array);

    
        if (array.length === 0) {
          document.getElementById("selectImage").value = null;
        }
    }

    reset() {
        console.log("ImageUploader2 reiniciamos!")
    
        this.setState({
          files: []
        })
    
        this.props.revertReset();
    }

    upload(e) {
        e.preventDefault();
        document.getElementById("selectImage").click();
    }

    uploadMultipleFiles(e) {
        let tmp_files = this.state.files;
    
        for (let i = 0; i < e.target.files.length; i++) {
          tmp_files.push(e.target.files[i]);
          console.log("it files uploaded, file: ", e.target.files[i])
        }
    
        this.setState({
          files: tmp_files,
        });

        this.props.onChange(tmp_files);
    }
    

    render() {
        return (
        <div className="form-group">
            <Form.Label>Imágenes</Form.Label>
            {this.props.reset ?
                this.reset()
                :null
            }

            <div className="form-group multi-image-preview">
                {(this.state.files).map((file) => (
                    <div className="image-preview" key={URL.createObjectURL(file)}>
                        <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => {
                                this.removeImage(file);
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>

                        <div>{this.state.files[0] === file ? <p>Portada</p> : null}</div>

                        <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            height="100"
                            width="auto"
                        />
                    </div>
                ))}
            </div>

            <button id="plus" onClick={this.upload}>
                Subir imágenes
            </button>
            
            <input
                id="selectImage"
                type="file"
                onChange={this.uploadMultipleFiles}
                multiple
                hidden
            />

        </div>
        );
    }
}

export default ImageUploader2;