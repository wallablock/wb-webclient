import React from 'react';
import { SelectedFilters, ReactiveList} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Popup from './Popup';

import getImages from './IPFSImage';

import MyCard from './MyCard';

class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPopup: false,
			offer: null
		};
	}

	render() {
		return(
			<div className="result-list">
				{this.state.showPopup ?
					<Popup
						offer={this.state.offer}
						closePopup={this.togglePopup.bind(this)}
					/>
					:null
				}

				<SelectedFilters className="m1" showClearAll={'default'} onClear={(component, value) => {
					console.log(`${component} has been removed with value as ${value}`);
					if (component === "myColorPicker" || !component) {
						//this.props.clearCFilter()
					}
				}}/>

				<ReactiveList
					componentId="results"
					dataField="Title"
					size={18}
					pagination={true}
					react={{
						and: ['search', 'price', 'category', 'myCustomSwitch', 'filtroPais'],
					}}
					render={({loading, error, data }) => {
						if (loading) {
							return <div> Loading... </div>;
						}
						if (error) {
							return <div> Something go wrong.</div>
						}
						if (data) {
							return(
								<ReactiveList.ResultCardsWrapper>


									{data.map(item => (
										<MyCard
											key={item.offer}
											data={item}
											onClack={this.cardClicked}
										/>
									))}
								</ReactiveList.ResultCardsWrapper>
							)
						}
					}}
				/>

			</div>
		)
	}
}

Results.propTypes = {
	toggleTopic: PropTypes.func,
	currentTopics: PropTypes.arrayOf(PropTypes.string),
};

export default Results;
