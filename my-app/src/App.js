import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import "./App.css";
import Home from './components/Home'
import Map from './components/Map'
function App() {
  
  return (
    <>
      <Router>
        <Switch>

          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/games/israel">
            <Map />
          </Route>

        </Switch>
      </Router>
    </>
  );
}

export default App;
