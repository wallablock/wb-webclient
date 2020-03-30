import React from 'react';
import PropTypes from 'prop-types';
import {
	SingleDropdownRange,
	RangeSlider,
	MultiDataList,
} from '@appbaseio/reactivesearch';

const SearchFilters = ({ currentTopics, setTopics, visible }) => (



	<div className={`flex column filters-container ${!visible ? 'hidden' : ''}`}>
			

	<div className="child m10">
		<MultiDataList
			componentId="Categoria"
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
			title="Categoria"
			showSearch={false}
		/>
	</div>

		<div className="child m11">
			<RangeSlider
				componentId="Precio"
				title="Precio"
				dataField="Precio"
				range={{ start: 0, end: 300000 }}
				showHistogram={false}
				rangeLabels={{
					start: '0 Eth',
					end: '500K Eth',
				}}
				innerClass={{
					label: 'range-label',
				}}
			/>
		</div>

		<div className="child m10">
			<SingleDropdownRange
				componentId="Antiguedad"
				dataField="Antiguedad"
				placeholder="Filtrar por fecha"
				title="Oferta creada"
				data={[
					{ start: 'now-1M', end: 'now', label: 'Últimos 30 días' },
					{ start: 'now-6M', end: 'now', label: 'Últimos 6 meses' },
					{ start: 'now-1y', end: 'now', label: 'Último año' },
				]}
			/>
		</div>
		
		<div className="child m10">
			<div className="col">
			
			</div>
		</div>

	</div>

);

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool,
};

export default SearchFilters;