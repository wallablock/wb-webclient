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

	/*

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
		//this.togglePopup();


		console.log("cardClicked")


		this.setState({
			offer: data,
			showPopup: !this.state.showPopup
		});

		if (this.state.offer != null) {
			this.setState({
				offer: null
			});
		}


	}*/

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

/*
	async myFunc(data) {
		console.log("myFunc()")
		console.log(data.length)



		let imgs = []

		for (let i = 0; i < data.length; i++) {
			//console.log("it")
			const tmp_item = data[i];
			//console.log(tmp_item.cid)

			const url_tmp = await getImages(data[0].cid)
			//console.log(url_tmp)

			imgs.push(url_tmp)

		}
		return imgs;
	}

	async test2 (data) {
		console.log("fuck")

		(	
		<div className="result-item" key={data.offer} onClick={this.cardClicked.bind(this, data)}> 
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
		)}

	

	 test = (data, img ) => (
		console.log("inside test"),
		console.log(img),


		<div className="result-item" key={data.offer} onClick={this.cardClicked.bind(this, data)}> 
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
	*/

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
							//let imgs = this.myFunc(data);

							//let i = 0;
							return(
								<ReactiveList.ResultCardsWrapper>
									
								
									{data.map(item => (
										<MyCard 
											key={item.offer}
											data={item}
											onClack={this.cardClicked}
										/>
										//this.test(item, imgs[i])
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
