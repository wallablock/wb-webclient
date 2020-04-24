import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	MultiDropdownList,
	RangeSlider,
	MultiDataList,
	ReactiveComponent,
} from '@appbaseio/reactivesearch';



import getCountryInfo from './countries';

// TODO: Switch to https://github.com/palmerhq/the-platform#stylesheet when it will be stable
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const ttts = "https://restcountries.eu/data/esp.svg";

class SearchFilters extends Component {

	constructor(props) {
		super(props);
		this.state = {
			countries: [],
			countries2: new Map(),
		};
	}


	render() {
		return (
			<div className={`flex column filters-container ${!this.props.visible ? 'hidden' : ''}`}>
			

		<div className="child m10">
			<MultiDataList
				componentId="category"
				dataField="category"
				data={
					[{
					label: "TVs",
					value: "tvs"
					}, {
					label: "Electrodomésticos",
					value: "electrodomesticos"
					}, {
					label: "Móviles",
					value: "moviles"
					},{
					label: "Vehiculos",
					value: "Vehiculos"
					}, {
					label: "Motos",
					value: "motos"
					}, {
					label: "Inmobiliaria",
					value: "inmobiliaria"
					}]
				}
				title="Categoría"
				innerClass={{
					title: "cat-tit",
					label: "cat-label"
				}}
				className="categs"
				showSearch={false}
			/>
		</div>
		
		<div>
			<hr className="solid" />
		</div>


		<div className="child m11">
			<RangeSlider
				componentId="price"
				title="Precio"
				dataField="price"
				range={{ start: 0, end: 500000 }}
				showHistogram={false}
				rangeLabels={{
					start: '0 Eth',
					end: '500K Eth',
				}}
				innerClass={{
					label: 'range-label',
					title: 'range-title'
				}}
				className="range"

			/>
		</div>

		<div className="separator">
			<hr className="solid" />
		</div>


		
		<div className="m13">
			<p className="m14">País de origen</p>





			

			<MultiDropdownList
				componentId="filtroPais"
				dataField="pais2"
				filterLabel="país"
				placeholder="Todos"
				showSearch={true}
				searchPlaceholder="Buscar país..."




/*
				transformData= {(data) => {
					console.log("TransformData")
					//this.constApiRest2(data)
					

					for (let i = 0; i < data.length; i++) {

						if (data[i].key.length === 3) data[i].key = getCountryInfo(data[i].key, "name")
					}
					return data
				}}*/


				renderItem={(label, count, isSelected) => (
					<div className="flex">
						<img  style={{marginRight: 7, marginTop: 2}} height="15"  src={getCountryInfo(label, "flag")}/> 

						{label}
						<span style={{
							marginLeft: 5, color: isSelected ? 'red' : 'dodgerblue'
						}}>
							{count}
						</span>
					</div>

				)}

				

			/*	renderItem={(label, count, isSelected) => (
					
					this.state.countries[label] ?
					console.log("cas1")
					:console.log("cas2"),

					
					this.setState({
						countries: this.state.countries.concat(["a"] = "b")
					}),

					/*fetch('https://restcountries.eu/rest/v2/alpha/' + `${label}`)
					.then(res => res.json())
					.then((data) => {
						console.log("dins then")
						console.log(data)

						const newCountries = this.state.countries
						newCountries[label] = data
						
						this.setState({ countries:  newCountries})
						
					})
					.catch(console.log),
					<div className="flex">
						<img  style={{marginRight: 7, marginTop: 2}} height="15"  src="https://restcountries.eu/data/esp.svg"/>
						{label}
						<span style={{
							marginLeft: 5, color: isSelected ? 'red' : 'dodgerblue'
						}}>
							{count}
						</span>
					</div>
					

				)}*/


				onError={(error) => (
					console.log("OnError"),
					console.log(error)

				)
			}
			/>

			







		</div>


	
	</div>


		);
	}




}


//			<CountryFilter />


/*

<ReactiveComponent
				componentId="myColorPicker"   // a unique id we will refer to later
				defaultQuery={() => ({
					aggs: {
						shipsFrom: {
							terms: {
								field: 'shipsFrom'
							}
						}
					}
				})}
				filterLabel="pais"
				render={({ aggregations, setQuery }) => (
						<ColorPickerWrapper
							sQ={sQ}
							aggregations={aggregations}
							setQuery={setQuery}
						/>
					)}
			/>

*/

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool,
};

export default SearchFilters;