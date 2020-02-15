import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Fortmatic from "fortmatic";
import Web3 from "web3";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9");
let web3 = new Web3(fm.getProvider());

const listings = [
  {
    name: "House 1",

    address: "123 Broadway, Denver, CO",
    rent: "50 DAI",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Isaac_Bell_House_2018-06-13.jpg/1200px-Isaac_Bell_House_2018-06-13.jpg"
  },
  {
    name: "House 2",
    address: "253 11th St, Denver, CO",
    rent: "100 DAI",
    img:
      "https://www.trbimg.com/img-577423d8/turbine/ct-elite-street-sixteen-candles-evanston-home-for-sale-0630-biz-20160629"
  }
];

let handleGetAccounts = () => {
  web3.eth.getAccounts().then(console.log);
};

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="container">
      <button onClick={() => handleGetAccounts()}>web3.eth.getAccounts</button>
      {listings.map((l, i) => (
        <div key={i}>
          <h1>{l.name}</h1>;
          <p>
            Address: <b>{l.address}</b>
            Rent: <b>{l.rent}</b>
            <img src={l.img}></img>
          </p>
        </div>
      ))}
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
