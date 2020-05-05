import React, { Component } from "react";
import { ReactiveBase, DataSearch } from "@appbaseio/reactivesearch";

import Header from "./Header";
import Results from "./Results";

import theme from "../theme";
import "../App.css";

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTopics: [],
      resetCountryFilter: null,
    };
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

  render() {
    return (
      <section className="containererer">
        <ReactiveBase
          app="testweb" //en un futuro: offers
          url="https://ae4d7ff23f8e4bcea2feecefc1b2337a.eu-central-1.aws.cloud.es.io:9243"
          credentials="webtest:webtest"
          //headers={{Authorization: `ApiKey MWxYb3BuRUJxeXpfeTlwQW1jUVY6S09PdDhqNDRTaGlSVEdadFFaRXZ5dw==`}}
          theme={theme}
        >
          <div className="flex app-container">
            <Header sQ={this.sQ} />

            <div className="results-container">
              <DataSearch
                componentId="search"
                filterLabel="Search"
                dataField={["title", "title.completion", "category"]}
                placeholder="Buscar..."
                iconPosition="left"
                autosuggest={true}
                URLParams={true}
                className="data-search-container results-container"
                innerClass={{
                  input: "search-input",
                }}
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
