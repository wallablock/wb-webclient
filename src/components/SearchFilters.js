import React from 'react';
import PropTypes from 'prop-types';
import {
	MultiDropdownList,
	SingleDropdownRange,
	RangeSlider,
	SingleList,
} from '@appbaseio/reactivesearch';

const SearchFilters = ({ currentTopics, setTopics, visible }) => (
	<div className={`flex column filters-container ${!visible ? 'hidden' : ''}`}>
		
		<div className="child m10">
			<RangeSlider
				componentId="stars"
				title="Precio"
				dataField="stars"
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
				componentId="pushed"
				dataField="pushed"
				placeholder="Filtrar por fecha"
				title="Oferta creada"
				filterLabel="Last Active"
				data={[
					{ start: 'now-1M', end: 'now', label: 'Últimos 30 días' },
					{ start: 'now-6M', end: 'now', label: 'Últimos 6 meses' },
					{ start: 'now-1y', end: 'now', label: 'Último año' },
				]}
			/>
		</div>
		
		<div className="child m10">
			<SingleList
				componentId="categorias"
				title="Categorías"
				
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