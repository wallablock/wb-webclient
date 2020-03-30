import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import './App.css';


import MainPage from "./pages";
import CreateAcc from "./pages/keygenerator"
import Publish from "./pages/publish"
import NotFoundPage from "./pages/404";

class App extends Component {


  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/generate" component={CreateAcc} />
          <Route exact path="/publish" component={Publish} />
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect to="/404"/>
        </Switch>
      </Router>
    );
  }
}
export default App;