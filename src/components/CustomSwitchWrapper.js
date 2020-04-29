import React, { Component } from 'react';
import CustomSwitch from './CustomSwitch';


class CountryPickerWrapper extends Component {
	
	resetFilter = () => {
		let q = null
		this.props.setQuery({
			q,
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
								term: { seller: account},
							},
						}
							
						this.props.setQuery({
							query,
							value: account,
						});
					}
					else this.resetFilter();					
				}}
			/>
		);
	}
}

export default CountryPickerWrapper;