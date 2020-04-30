import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}
export default App;
