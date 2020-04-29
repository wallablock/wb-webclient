import React from 'react';
import { SelectedFilters, ReactiveList} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Popup from './Popup';



class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPopup: false,
			offer: null
		};
	}

	togglePopup() {  
		this.setState({  
			showPopup: !this.state.showPopup  
		}); 
		if (this.state.offer != null) {
			this.setState({
				offer: null
			});
		}

	}

	cardClicked(data) {
		//this.props.togglePopupHC(data);
		this.togglePopup();
		this.setState({
			offer: data
		});
	}

/*
		<div className="result-item" key={offer} onClick={this.cardClicked.bind(this, {offer, title, price})}> 
			<img className="card-img" src="anuncios/iphon.jpg" />
			<div classname="flex row-reverse  card-info">
				<div className="card-info-title">
					Title: {title} 

				</div>

				<div className="card-info-price">
					Price: {price}

				</div>
				

			</div>
			
		</div>
*/
	test = (data /*{offer, title, price}*/) => (
		<div className="result-item" key={data.offer} onClick={this.cardClicked.bind(this, data/*{offer, title, price}*/)}> 
			<img className="card-img" src="anuncios/xbox.jpg" />
			<div className="flex column card-info">
				<div className="card-info-price">
					{data.price} Eth
				</div>
			
				<div className="card-info-title">
					{data.title} 
				</div>

			</div>
		
		</div>
		
			
	)

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

										this.test(item)
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

/*
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

*/




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
