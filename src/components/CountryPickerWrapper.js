import React, { Component } from 'react';
import CountryPicker from './CountryPicker';


class CountryPickerWrapper extends Component {
	constructor(props) {
		super(props);
		//this.props.sQ(this.resetFilter);
		this.state = {
			selectedCountries: [],
		};
	}

	resetFilter = () => {
		this.setState({
			selectedCountries: [],
		})

		let q = null
		this.props.setQuery({
			q,
			value: "",
		});
	}

	removeItem = (array, value) => {
		let newArray = [];
		let lastI = 0;
		let i = 0;
		for (; i < array.length; i++) {
			if (array[i] === value) {
				for (let j = lastI; j < i; j++) {
					newArray.push(array[j])
				}
				lastI = i + 1;
			}
		}
		if (lastI <= i) {
			for (let j = lastI; j < i; j++) {
				newArray.push(array[j])
			}
		} 

		return newArray;
	}


	render() {

		if (
			// checking for when component gets the aggregation results
			this.props.aggregations &&
			this.props.aggregations.colors &&
			this.props.aggregations.colors.buckets.length
		) {
			//colors = this.props.aggregations.map(color => color.key);
		}

		return (
			<CountryPicker
				countryFilter={this.props.countryFilter}
				//colors={colors}
				onChange={newCountry => {
					let countries = this.state.selectedCountries;
					
					console.log("inside onChange")
					console.log(countries)

					console.log(newCountry)
					// handles color change

					//const countries = colors
					//let newC = []
					if (countries.includes(newCountry)) {
						countries = this.removeItem(countries, newCountry)
						console.log("inside IF1")
						console.log(countries)

					}
					else {
						countries = countries.concat(newCountry)
						console.log("inside ELSE1")
						console.log(countries)
					} 

					this.setState({
						selectedCountries: countries
					})
					

					let query = {}

					if (countries.length > 1) {
						console.log("inside IF")

						query = {
							query: {
								terms: { shipsFrom: countries },
							},
						}
					}
					else if (countries.length == 1) {
						console.log("inside ELSE IF")
						console.log(countries.length)

						
						query = {
							query: {
								term: { shipsFrom: countries[0]},
							},
						}
					}
					else {
						console.log("inside ELSE")
						//this.props.setQuery(null);
						query = null
					}

					console.log(query)
					/*
					const query = {
						query: {
							terms: { shipsFrom: newColor },
						},
					};*/https://github.com/manindu/ReactiveSearchRangeSlider

					this.props.setQuery({
						query,
						value: countries,
					});
				}}
			/>
		);
	}
}

export default CountryPickerWrapper;