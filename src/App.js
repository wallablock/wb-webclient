import React, { Component } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';

import theme from './theme';
import './App.css';

import Results from './components/Results';
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTopics: [],
    };
  }

  setTopics = (currentTopics) => {
    this.setState({
      currentTopics: currentTopics || [],
    });
  }

  toggleTopic = (topic) => {
    const {currentTopics} = this.state;
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
          app="test"
          credentials="alex:123456"
          url="https://f90c7dc79c2b425caf77079b50ec5677.eu-central-1.aws.cloud.es.io"
          theme={theme}
        >
  

          <div className="flex row-reverse">
            <Header currentTopics={this.state.currentTopics} setTopics={this.setState} />
            <div className="results-container">
              <DataSearch
                  componentId="repo"
                  filterLabel="Search"
                  dataField={'found'}
                  autosuggest={false}
              />
              <Results currentTopics={this.state.currentTopics} toggleTopic={this.toggleTopic}/>
            </div>
          </div>
        </ReactiveBase>
      </section>
    );
  }
}
export default App;