import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import Box from "3box";

import 'bulma/css/bulma.css'

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9");
let web3 = new Web3(fm.getProvider());

let addr = "";
let box;

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

async function handleGetAccounts() {
  web3.eth.getAccounts().then(async address => {
    addr = address[0];
    console.log("Address: ", addr);
    await open3Box();
    await set3BoxData("testing", "value");
    await get3BoxData("testing");
    await remove3BoxData("testing");
  });
}

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
              <Link to="/listingdetails">About</Link>
            </li>
            <li>
              <Link to="/lockcontrols">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/listingdetails">
            <ListingDetails />
          </Route>
          <Route path="/lockcontrols">
            <LockControls />
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
      <button onClick={() => handleGetAccounts()}>
        Get Accounts + 3Box Testing
      </button>
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

function ListingDetails() { // Includes listing confirmation modal
  return (
    <section>
      <h1>LISTING DETAILS</h1>
    </section>
  )
}

function LockControls() {
  return(
    <section>
      <h1>LOCK CONTROLS:</h1>
      <button>Unlock</button>
      <button>Lock</button>
    </section>
  )
}

async function open3Box() {
  box = await Box.openBox(addr, fm.getProvider());
  await box.syncDone;
  console.log("Opened 3box box for ", addr);
}

async function set3BoxData(key, value) {
  await box.private.set(key, value);
  console.log("Set private value in 3box (key: ", key, ")");
}

async function get3BoxData(key) {
  await box.private.get(key);
  console.log("Got private value in 3box (key: ", key, ")");
}

async function remove3BoxData(key) {
  await box.private.remove(key);
  console.log("Removed private value in 3box (key: ", key, ")");
}
