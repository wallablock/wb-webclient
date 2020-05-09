import React, { Component } from "react";
import Form from "react-bootstrap/Form";

import "./styles/ImageUploader.css";

export default class MultipleImageUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.fileObj = [];
    this.fileArray = [];
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
  }

  uploadMultipleFiles(e) {
    let tmp_files = this.state.files;

    for (let i = 0; i < e.target.files.length; i++) {
      tmp_files.push(e.target.files[i]);
    }

    this.setState({
      files: tmp_files,
    });

    this.props.onChange(tmp_files);
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

    if (array.length === 0) {
      document.getElementById("selectImage").value = null;
    }
  }

  handleClose(param) {
    this.removeImage(param);
  }

  upload(e) {
    e.preventDefault();
    document.getElementById("selectImage").click();
  }

  reset() {
    console.log("ImageUploader reiniciamos!")

    this.setState({
      files: []
    })


    this.props.revertReset();
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
          {(this.state.files || []).map((file) => (
            <div className="image-preview" key={URL.createObjectURL(file)}>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => {
                  this.handleClose(file);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <div>{this.state.files[0] === file ? <p>Portada</p> : null}</div>

              <img
                src={URL.createObjectURL(file)}
                alt="..."
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
