import React, { Component } from 'react';

import SearchFilters from './SearchFilters';

import '../App.css';

import {
	Link
  } from "react-router-dom";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	toggleVisibility = () => {
		const visible = !this.state.visible;
		this.setState({
			visible,
		});
	}

	render() {
		return (
            /*<div className="bar">
                <div className="title">WallaBlock</div>
                <SearchFilters currentTopics={this.state.currentTopics} setTopics={this.setTopics}/>
            </div>*/


			<nav className={`bar ${this.state.visible ? 'active' : ''}`}>
				<div className="title">WallaBlock</div>
				<div className="btn toggle-btn" onClick={this.toggleVisibility}>Toggle Filters</div>

				<div className="flex flex-reverse bts_content">
					<div className="bts_wrap">
						<Link to="/generate">
							<input type="button" className="btn bts " value="Generar cuenta"/>
						</Link>
					</div>
					<div className="bts_wrap">
						<Link to="/publish">
							<input type="submit" className="btn bts" value="Publicar oferta"/>
						</Link>
					</div>
				</div>
				
                
                <SearchFilters {...this.props} visible={this.state.visible} />
			</nav>
		);
	}
}

export default Header;