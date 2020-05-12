import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import HomeComponent from "./components/HomeComponent";
import NewAccount from "./components/NewAccount";
import PublishComponent from "./components/PublishComponent";
import OfferDetail from "./components/OfferDetail";
import ViewAllOffers from "./components/ViewAllOffers";
import NotFoundComponent from "./components/NotFoundComponent";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomeComponent} />
          <Route exact path="/generate" component={NewAccount} />
          <Route exact path="/publish" component={PublishComponent} />
          <Route exact path="/offer/:offerId" component={OfferDetail} />
          <Route exact path="/alloffers" component={ViewAllOffers} />

          <Route path="*" component={NotFoundComponent} />
        </Switch>
      </Router>
    );
  }
}
export default App;
