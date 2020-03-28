import React, { Component } from 'react';

import SearchFilters from './SearchFilters';

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
				
				
                
                <SearchFilters {...this.props} visible={this.state.visible} />
			</nav>
		);
	}
}

export default Header;