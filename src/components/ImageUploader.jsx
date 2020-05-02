import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import './styles/PublishStyle.css';

export default class MultipleImageUploadComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            file: []
        }
        this.fileObj = [];
        this.fileArray = [];
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }

    uploadMultipleFiles(e) {
        this.fileObj = [];
        this.fileArray = [];
        this.setState({file: []})

        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
        }

        this.setState({ file: this.fileArray })

    }

    uploadFiles(e) {
        e.preventDefault()
        console.log(this.state.file)
    }

    removeImage(img) {
        console.log("removeImage()")
        console.log(img.url)

        var array = [...this.state.file]; // make a separate copy of the array
        console.log(array)
        var index = array.indexOf(img.url)
        console.log(index)
        if (index !== -1) {
            console.log("REMOVES")
          array.splice(index, 1);
          this.setState({file: array});
        }
    }

    handleClose(param) {
        console.log("handleClose");
        console.log(param);
        this.removeImage(param);
    }

    upload() {
        console.log("upload")
        document.getElementById("selectImage").click()
    }

    render() {
        return (
            <div className="form-group">
                <Form.Label>Imágenes</Form.Label>

                {
                console.log("state.file"),
                console.log(this.state.file)
                }


                <div className="form-group multi-image-preview">
                    {(this.state.file || []).map(url => (
                        <div key={url} className="image-preview" >
                            <button type="button" className="close" aria-label="Close" onClick={() => {
                                this.handleClose({url})
                            }}>
                                <span aria-hidden="true">&times;</span>
                            </button>

                            <img src={url} alt="..." height="100" width="auto"/>
                        </div>
                    ))}
                </div>



                <div className="form-group ">
                    <button id='plus' onClick={this.upload}>+</button>
                    <input id='selectImage' type="file" onChange={this.uploadMultipleFiles} hidden multiple />
                </div>


            </div>
        )
    }
}

//he de adaptar el tamany  de imatge
//afegir separadors entre imatges
