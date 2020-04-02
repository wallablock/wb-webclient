import React from 'react';
import PropTypes from 'prop-types';
import {
	SingleDropdownRange,
	RangeSlider,
	MultiDataList,
	MultiDropdownList,
} from '@appbaseio/reactivesearch';

import { Container, Header, List } from "semantic-ui-react";
import CountryList from "./CountryList";

// TODO: Switch to https://github.com/palmerhq/the-platform#stylesheet when it will be stable
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const SearchFilters = ({ currentTopics, setTopics, visible }) => (



	<div className={`flex column filters-container ${!visible ? 'hidden' : ''}`}>
			

		<div className="child m10">
			<MultiDataList
				componentId="Categoria"
				dataField="name"
				data={
					[{
					label: "TVs",
					value: "TVs"
					}, {
					label: "Electrodomésticos",
					value: "electrodomesticos"
					}, {
					label: "Móviles",
					value: "moviles"
					},{
					label: "Coches",
					value: "coches"
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
				componentId="Precio"
				title="Precio"
				dataField="Precio"
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
			<p className="m14">País de orgien</p>
			<CountryList />
		</div>

		<div className="separator">
			<hr className="solid" />
		</div>

		<div className="child m12">
			<SingleDropdownRange
				componentId="Antiguedad"
				dataField="Antiguedad"
				placeholder="Filtra por antiguedad"
				title="Oferta creada"
				data={[
					{ start: 'now-1M', end: 'now', label: 'Últimos 30 días' },
					{ start: 'now-6M', end: 'now', label: 'Últimos 6 meses' },
					{ start: 'now-1y', end: 'now', label: 'Último año' },
				]}
				innerClass={{
					title: 'fecha-title'
				}}
				className="fecha"
			/>
		</div>

	
	</div>

);

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool,
};

export default SearchFilters;