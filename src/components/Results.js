import React from 'react';
import { SelectedFilters, ReactiveList} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';



function test(offer) {
	return (
		<div className="result-item" key={offer._id}> 
			{offer.title} 
		</div>
		
	)
}



const Results = ({ toggleTopic, currentTopics }) => (
	<div className="result-list">
		<SelectedFilters className="m1" showClearAll={'default'}/>
		<ReactiveList
			componentId="results"
			dataField="Title"
			size={8}
			pagination={true}
			react={{
				and: ['search', 'price', 'category'],
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
								test(item)
							))}
						</ReactiveList.ResultCardsWrapper>
					)
				}
				
			}}
		>
			
		</ReactiveList>
	</div>
);

/*{({loading, error, data }) => {
				if (loading) {
					return <div> Loading... </div>;
				}
				if (error) {
					return <div> Some</div>
				}
				return (
						<div>
							{offer.Title}

							{console.log("map it")}
						</div>
					)
				}
			}
*/

/* 
			render={({ data }) => (
				<ReactiveList.ResultCardsWrapper>
					{data.map(item => (
						<div>
							<p> {item.Title}</p>

							{console.log("map it")}
						</div>
					))}
				</ReactiveList.ResultCardsWrapper>
			)} 
*/

/*
		<ReactiveList
			componentId="results"
			dataField="name"
			onData={data => onData(data)}
			onResultStats={onResultStats}


		
		
		/>
*/

Results.propTypes = {
	toggleTopic: PropTypes.func,
	currentTopics: PropTypes.arrayOf(PropTypes.string),
};

export default Results;
