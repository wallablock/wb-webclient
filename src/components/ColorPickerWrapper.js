import React, { Component } from 'react';
import ColorPicker from './ColorPicker';


class ColorPickerWrapper extends Component {
	render() {
		let colors = [];

		if (
			// checking for when component gets the aggregation results
			this.props.aggregations &&
			this.props.aggregations.colors &&
			this.props.aggregations.colors.buckets.length
		) {
			colors = this.props.aggregations.map(color => color.key);
		}

		return (
			<ColorPicker
				colors={colors}
				onChange={newColor => {
					console.log("inside onChange")
					console.log(newColor)
					// handles color change
					const query = {
						query: {
							term: { shipsFrom: newColor },
						},
					};

					this.props.setQuery({
						query,
						value: newColor,
					});
				}}
			/>
		);
	}
}

export default ColorPickerWrapper;