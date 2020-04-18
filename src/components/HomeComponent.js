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
					app="testweb"
					url="https://ae4d7ff23f8e4bcea2feecefc1b2337a.eu-central-1.aws.cloud.es.io:9243"
					credentials="webtest:webtest"

					theme={theme}
				>
					<div className="flex row-reverse app-container">

						<Header  />

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
					

							<Results />


						</div>
					</div>
				</ReactiveBase>
			</section>
		);
	}
}

/*



*/




//						<Header currentTopics={this.state.currentTopics} setTopics={this.setTopics} />


// <ImageReader />

//							<Results currentTopics={this.state.currentTopics} toggleTopic={this.toggleTopic} cardClickedHC={this.cardClickedHC} />


export default HomeComponent;
