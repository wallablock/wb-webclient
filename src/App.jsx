import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import HomeComponent from "./components/HomeComponent";
import PublishComponent from "./components/PublishComponent";
import OfferDetail from "./components/OfferDetail";
import ViewAllOffers from "./components/ViewAllOffers";
import NotFoundComponent from "./components/NotFoundComponent";

import {fetchConfig} from './components/WbConfig';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null
    }

    this.getConfig();
  }


  /****CONFIG****/
  async getConfig() {
    const url = await this.getElasticUrl();
    const key = await this.getElasticKey();
    const ipfs = await this.getIPFSProxy();
    const registry = await this.getRegistry();

    this.setState({
      config: {
        "url": url, 
        "key": key,
        "ipfs": ipfs,
        "registry": registry
      }
    })
  }

  async getElasticUrl() {
    const response = fetchConfig();
    const url = await response.elastic.url;
    return url;
  }

  async getElasticKey() {
    const response = fetchConfig();
    const key = await response.elastic.key;
    return key;
  }

  async getIPFSProxy() {
    const response = fetchConfig();
    const ipfs = await response.fileproxyUrl;
    return ipfs;
  }

  async getRegistry() {
    const response = fetchConfig();
    const registry = await response.registryAddress;
    return registry;
  }
  /**************/

  render() {
    return (
      <div>
        {
          this.state.config !== null ?
          <Router>
            <Switch>
              <Route exact path="/" /*component={HomeComponent}*/ render={(props) => <HomeComponent {...props} config={this.state.config} />} />
              <Route exact path="/publish" /*component={PublishComponent}*/ render={(props) => <PublishComponent {...props} config={this.state.config} />} />
              <Route exact path="/buy/:offerId" /*component={OfferDetail}*/ render={(props) => <OfferDetail {...props} config={this.state.config} />} />
              <Route exact path="/alloffers" /*component={ViewAllOffers}*/ render={(props) => <ViewAllOffers {...props} config={this.state.config} />} />

              <Route path="*" component={NotFoundComponent} />
            </Switch>
          </Router>
          :null
        }
      
      </div>

    );
  }
}
export default App;
