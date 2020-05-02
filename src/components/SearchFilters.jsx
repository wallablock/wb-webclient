import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	MultiDropdownList,
	RangeSlider,
	MultiDataList,
	ReactiveComponent,
} from '@appbaseio/reactivesearch';


import Form from 'react-bootstrap/Form';


import {getName} from 'country-list';
import ReactCountryFlag from "react-country-flag"


import CustomSwitchWrapper from './CustomSwitchWrapper';


// TODO: Switch to https://github.com/palmerhq/the-platform#stylesheet when it will be stable
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);






class SearchFilters extends Component {

	constructor(props) {
		super(props);
		this.state = {
			countries: [],
			countries2: new Map(),
		};
	}

	halfOpts (data, handleChange) {
		return (
		data.map(item => (
			console.log("ITEM"),
			console.log(item),



			<div>
				<Form.Check
					type='checkbox'
					id={`default-${item.label}`}
					label={item.label}
					onClick={() => handleChange(item.label)}
				/>
			</div>


		))
		);
	}

	render() {
		return (




			<div className={`flex column`}>




				<div className="m13">


				<div className="child m10">
					<MultiDataList
						componentId="category"
						dataField="category"
						showCount={true}
						fielddata={true}
						URLParams={true}
						data={
							[{
							label: "Electrónica",
							value: "electronica"
							}, {
							label: "Electrodomésticos",
							value: "electrodomesticos"
							}, {
							label: "Inmobiliaria",
							value: "inmobiliaria"
							}, {
							label: "Móviles",
							value: "moviles"
							},{
							label: "Ordenadores",
							value: "ordenadores"
							}, {
							label: "Televisores",
							value: "tv"
							}, {
							label: "Vehículos",
							value: "vehiculos"
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

				<div className="separator">
					<hr className="solid" />
				</div>


				<p className="m14 pfilt">País de origen</p>
					<MultiDropdownList
						componentId="filtroPais"
						dataField="shipsFrom"
						filterLabel="país"
						placeholder="Todos"
						searchPlaceholder="Buscar país..."
						size={250}
						URLParams={true}


						style={
							{'max-height': '50px'}
						}

						innerClass={{
							list: "pfilt",
						}}




						renderItem={(label, count, isSelected) => (
							<div className="flex">


								<ReactCountryFlag
									countryCode={label}
									style={{
										fontSize: '1.5em',
										lineHeight: '1.5em',
										marginRight: 7,
										marginTop: 2
									}}
									svg
								/>

								{getName(label)}
								<span style={{
									marginLeft: 5, color: isSelected ? 'red' : 'dodgerblue'
								}}>
									{count}
								</span>
							</div>

						)}


						sortBy="asc"


						onError={(error) => (
							console.log("OnError"),
							console.log(error)

						)}
					/>



				<div className="separator2">
					<hr className="solid" />
				</div>

				<div className="child m11">
					<RangeSlider
						componentId="price"
						title="Precio"
						dataField="price"
						range={{ start: 0, end: 500000 }}
						showHistogram={false}
						URLParams={true}
						rangeLabels={{
							start: '0 Eth',
							end: '500K Eth',
						}}
						innerClass={{
							label: 'range-label',
							title: 'range-title'
						}}
						className="range"

						tooltipTrigger="hover"
						renderTooltipData={data => (
							<h5 style={{
								color: 'white',
							}}>
								{data}
							</h5>
						)}


					/>
				</div>




				<div className="separator2">
					<hr className="solid" />
				</div>












				<ReactiveComponent
					componentId="myCustomSwitch"   // a unique id we will refer to later
					showFilter={false}
					render={({ aggregations, setQuery }) => (
							<CustomSwitchWrapper
								aggregations={aggregations}
								setQuery={setQuery}
							/>
						)}
				/>















				</div>

			</div>



		);
	}
}

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool,
};

export default SearchFilters;
