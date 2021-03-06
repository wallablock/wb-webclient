import React, { Component } from "react";
import Switch from "react-switch";

import "./styles/CustomSwitch.css";

class CustomSwitch extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }


  async getAccount() {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.enable();
        return accounts[0];
    }
}

  async handleChange(checked) {
    let account = null;
    if (checked) {
      account = await this.getAccount();

      if (account === null) checked = false;
    }

    this.props.onChange(checked, account);

    this.setState({ checked });
  }

  render() {
    return (
      <label className="my-adds-wrapper" htmlFor="material-switch">
        <div className="">
          <span className="my-adds-text">Ver sólo mis anuncios</span>
        </div>
        <div className="">
          <Switch
            checked={this.state.checked}
            onChange={this.handleChange}
            onColor="#71E275"
            onHandleColor="#FFFFFF"
            handleDiameter={25}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
        </div>
      </label>
    );
  }
}

export default CustomSwitch;
