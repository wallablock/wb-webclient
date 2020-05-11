import React, { Component } from "react";
import { ReactiveBase, DataSearch } from "@appbaseio/reactivesearch";

import Header from "./Header";
import Results from "./Results";
import YourOffers from "./YourOffers";

import theme from "../theme";
import "./styles/HomeComponent.css";

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTopics: [],
      resetCountryFilter: null,
      showYourOffers: false
    };

    this.openYourOffers = this.openYourOffers.bind(this);
    this.closeYourOffers = this.closeYourOffers.bind(this);
  }

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
        {this.state.showYourOffers ? 
          (<YourOffers
              close={this.closeYourOffers}
          />) 
          : null
        }

        <ReactiveBase
          app="testweb" //en un futuro: offers
          url="https://ae4d7ff23f8e4bcea2feecefc1b2337a.eu-central-1.aws.cloud.es.io:9243"
          credentials="webtest:webtest"
          //headers={{Authorization: `ApiKey MWxYb3BuRUJxeXpfeTlwQW1jUVY6S09PdDhqNDRTaGlSVEdadFFaRXZ5dw==`}}
          theme={theme}
        >
          <div className="flex app-container">
            <Header open={this.openYourOffers} sQ={this.sQ}/>

            <div className="results-container">
              <DataSearch
                componentId="search"
                filterLabel="Search"
                dataField={["title"]}
                placeholder="Buscar..."
                iconPosition="left"
                autosuggest={true}
                URLParams={true}
                className="data-search-container results-container"
                innerClass={{
                  input: "search-input",
                }}
               // strictSelection={true}
        
                defaultQuery={
                  function(value, props) {
                    //console.log("default query, props: ", props)
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

              <Results clearCFilter={this.clearCFilter} />
            </div>
          </div>
        </ReactiveBase>
      </section>
    );
  }
}

export default HomeComponent;
