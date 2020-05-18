import React, { Component } from "react";
import { ReactiveBase, DataSearch } from "@appbaseio/reactivesearch";

import Header from "./Header";
import Results from "./Results";
//import YourOffers from "./YourOffers";

import theme from "../theme";
import "./styles/HomeComponent.css";

class HomeComponent extends Component {
  constructor(props) {
    super(props);

    const config = this.props.config

    this.state = {
      currentTopics: [],
      resetCountryFilter: null,
      showYourOffers: false,
      config: config,
    };

    this.openYourOffers = this.openYourOffers.bind(this);
    this.closeYourOffers = this.closeYourOffers.bind(this); 
  }

  //Hem de borrar segurament
  sQ(func) {
    this.setState({
      resetCountryFilter: func,
    });
  }

  clearCFilter() {
    this.state.resetCountryFilter();
  }

  /**FILTERS STATE FUNCTIONS**/
  setTopics(currentTopics) {
    this.setState({
      currentTopics: currentTopics || [],
    });
  }

  toggleTopic(topic) {
    const { currentTopics } = this.state;
    const nextState = currentTopics.includes(topic)
      ? currentTopics.filter((item) => item !== topic)
      : currentTopics.concat(topic);
    this.setState({
      currentTopics: nextState,
    });
  }


  //Your offers
  openYourOffers() {
    console.log("clicked")

    this.setState({
      showYourOffers: true
    })
  }

  closeYourOffers() {
    this.setState({
      showYourOffers: false
    })
  }
  //

  render() {
    return (
      <section className="containererer">
        <ReactiveBase
          app="offers"
          url={this.state.config.url}
          //credentials="webtest:webtest"
          headers={{Authorization: `ApiKey ${this.state.config.key}`}}
          theme={theme}
          >
          <div className="flex app-container">
            <Header /*open={this.openYourOffers}*/ sQ={this.sQ}/>

            <div className="results-container">
              <DataSearch
                componentId="search"
                filterLabel="Search"
                dataField={["title", "title.keyword"]}
                placeholder="Buscar..."
                iconPosition="left"
                autosuggest={true}
                URLParams={true}
                className="data-search-container results-container"
                innerClass={{
                  input: "search-input",
                }}

                defaultQuery={
                  function(value, props) {
                    return {
                      query: {
                        wildcard: {
                            title: {
                                value: value + "*",
                                boost: 1.0,
                                rewrite: "constant_score"
                            }
                        }
                      }
                    }
                  }
                }
              />

              <Results clearCFilter={this.clearCFilter} ipfs={this.props.ipfs}/>
            </div>
          </div>
        </ReactiveBase>
       
      </section>
    );
  }
}

export default HomeComponent;
