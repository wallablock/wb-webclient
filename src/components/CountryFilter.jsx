import React, { Component } from "react";

import "./styles/CountryFilter.css";

class CountryFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
    };
  }

  countries() {
    if (this.state.countries.length === 0) {
      return "Todos";
    } else {
      return this.state.countries;
    }
  }

  handleClick() {
    if (this.state.countries.length > 0) {
      this.setState({
        countries: this.state.countries.concat(", ESP"),
      });
    } else {
      this.setState({
        countries: this.state.countries.concat("ESP"),
      });
    }
  }

  render() {
    return (
      <div className="flex countryFilter">
        <p className="countries"> Filtrar: {this.countries()} &nbsp; &nbsp; </p>
        <p className="add-country" onClick={this.handleClick}>
          &#xFF0B;
        </p>
      </div>
    );
  }
}

export default CountryFilter;
