import React, { Component } from "react";

import SearchFilters from "./SearchFilters";

import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <nav className="mynavbar">
        <div className="mytitle">WallaBlock</div>

        <div className="flex row-reverse bts_content">
          <div className="bts_wrap">
            <Link to="/publish">
              <input
                type="button"
                className="button button1"
                value="Publicar oferta"
              />
            </Link>
          </div>
          <div className="bts_wrap">
            <Link to="/generate">
              <input
                type="button"
                className="button button1"
                value="Generar cuenta"
              />
            </Link>
          </div>
        </div>

        <SearchFilters {...this.props} visible={this.state.visible} />
      </nav>
    );
  }
}

export default Header;
