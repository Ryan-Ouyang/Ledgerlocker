import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bulma/css/bulma.css";
import "./App.css";

import Bookings from "./components/Bookings/Bookings";
import Owner from "./components/Owner/Owner";
import Home from "./components/Home/Home";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/bookings">
            <Bookings />
          </Route>
          <Route path="/owner">
            <Owner />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
