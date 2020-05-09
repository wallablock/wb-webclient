import React, { Component } from "react";
import CustomSwitch from "./CustomSwitch";

class CustomSwitchWrapper extends Component {
  resetFilter() {
    this.props.setQuery({
      q: null,
      value: "",
    });
  }

  render() {
    return (
      <CustomSwitch
        onChange={(active, account) => {
          if (active) {
            let query = {
              query: {
                term: { seller: account },
              },
            };

            this.props.setQuery({
              query,
              value: account,
            });
          } else this.resetFilter();
        }}
      />
    );
  }
}

export default CustomSwitchWrapper;
