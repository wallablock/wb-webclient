import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import HomeComponent from "./components/HomeComponent";
import PublishComponent from "./components/PublishComponent";
import OfferComponent from "./components/OfferComponent";
import ViewAllOffers from "./components/ViewAllOffers";
import NotFoundComponent from "./components/NotFoundComponent";

import {NotificationContainer} from 'react-notifications';

import {fetchConfig} from './components/WbConfig';

import { IpfsConnection } from "wb-ipfs";

import Web3 from "web3";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      ipfs: null,
      myweb3: new Web3(window.ethereum),
    }

    this.getConfig();

  }



  initIPFS(ipfs) {
    this.setState({
      ipfs: new IpfsConnection(ipfs)
    })
  }



  /****CONFIG****/
  async getConfig() {
    const url = await this.getElasticUrl();
    const key = await this.getElasticKey();
    const ipfs = await this.getIPFSProxy();
    const registry = await this.getRegistry();

    this.initIPFS(ipfs);

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
          this.state.config !== null && this.state.ipfs !== null?
          <Router>
            <Switch>
              <Route exact path="/" render={(props) => <HomeComponent {...props} config={this.state.config} ipfs={this.state.ipfs} />} />
              <Route exact path="/publish" render={(props) => <PublishComponent {...props} config={this.state.config} ipfs={this.state.ipfs} web3={this.state.myweb3} />} />
              <Route exact path="/buy/:offerId" render={(props) => <OfferComponent {...props} ipfs={this.state.ipfs} web3={this.state.myweb3} />} />
              <Route exact path="/alloffers" render={(props) => <ViewAllOffers {...props} config={this.state.config} ipfs={this.state.ipfs} web3={this.state.myweb3} />} />

              <Route path="*" component={NotFoundComponent} />
            </Switch>
          </Router>
          :null
        }
        <NotificationContainer/>
      </div>

    );
  }
}
export default App;
