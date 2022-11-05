import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import axios from "axios"
import HomePage from "./HomePage";
import Characters from "./Characters";
import CharactersDetails from "./CharacterDetails";
import Comics from "./Comics";
import ComicDetails from "./ComicDetails";
import Series from "./Series";
import SeriesDetails from "./SeriesDetails";

import Error from "../components/Error";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/characters/page/:id" component={Characters} />
        <Route exact path="/characters/:id" component={CharactersDetails} />
        <Route exact path="/comics/page/:id" component={Comics} />
        <Route exact path="/comics/:id" component={ComicDetails} />
        <Route exact path="/series/page/:id" component={Series} />
        <Route exact path="/series/:id" component={SeriesDetails} />
        <Route component={Error} />
      </Switch>
    </Router>
  );
};

export default App;
