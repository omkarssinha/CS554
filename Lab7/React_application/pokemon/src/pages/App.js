import React from "react";
import { BrowserRouter as Router, Routes, Route, Switch,
  Link,
  useRouteMatch } from "react-router-dom";
import '../App.css';
import PokemonDetails from './pokemonDetails';
import Page from './page';
import HomePage from "./HomePage";
import Trainer from './trainer';

function App() {

  console.log("HI from app.js")
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/pokemon/page/:pagenum" component={Page} />
        <Route exact path="/pokemon/:id" component={PokemonDetails } />
        <Route exact path="/trainer" component={Trainer} />
      {/*<Route component={Error} /> */}
      </Switch>
    </Router>
  );
}

export default App;
