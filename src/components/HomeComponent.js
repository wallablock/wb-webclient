import React, { Component } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';

import Header from './Header';
import Results from './Results';

import theme from '../theme';
import '../App.css';

class HomeComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTopics: [],
		};
	}

	/**FILTERS STATE FUNCTIONS**/
	setTopics = (currentTopics) => {
		this.setState({
			currentTopics: currentTopics || [],
		});
	}

	toggleTopic = (topic) => {
		const { currentTopics } = this.state;
		const nextState = currentTopics.includes(topic)
			? currentTopics.filter(item => item !== topic)
			: currentTopics.concat(topic);
		this.setState({
			currentTopics: nextState,
		});
	}


	render() {
		return (	
			<section className="container">
				<ReactiveBase
					app="test2"
					url="https://f90c7dc79c2b425caf77079b50ec5677.eu-central-1.aws.cloud.es.io:9243"
					credentials="alex:123456"

					theme={theme}
				>
					<div className="flex row-reverse app-container">
						<Header currentTopics={this.state.currentTopics} setTopics={this.setTopics} />
						<div className="results-container">
							<DataSearch
								componentId="search"
								filterLabel="Search"
								dataField={['title']}
								placeholder="Search Repos"
								iconPosition="left"
								autosuggest={true}
								URLParams
								className="data-search-container results-container"
								innerClass={{
									input: 'search-input',
								}}
							/>
							<Results currentTopics={this.state.currentTopics} toggleTopic={this.toggleTopic} cardClickedHC={this.cardClickedHC} />
						</div>
					</div>
				</ReactiveBase>
			</section>
		);
	}
}

export default HomeComponent;
