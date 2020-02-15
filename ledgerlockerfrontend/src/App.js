import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import Box from "3box";
import axios from "axios";

import "bulma/css/bulma.css";
import "./App.css";
import profileImage from "./assets/johndoe.png";

import MainListing from "./components/MainListing/MainListing";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9");
let web3 = new Web3(fm.getProvider());

let addr = "";
let box;

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
  const [listings, setListings] = useState([]);
  
	useEffect(() => {
    const fetchListings = async () => {
      const result = await axios(
        'http://localhost:3001/api/listings',
      );
      setListings(result.data);
    };
    fetchListings();
    console.log("Fetched listings")
  }, []);

	return (
		<Router>
			<div>
				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/lockcontrols">
            <LockControls />
          </Route>
          <Route path="/">
            <Home listings={listings}/>
          </Route>
          <Route path="/listings">
            <Listings />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home(props) {
	const leftColumnListings = [];
	const rightColumnListings = [];

	// For flowing two columns
	for (let i = 0; i < props.listings.length; i += 2) {
		leftColumnListings.push(props.listings[i]);
		rightColumnListings.push(props.listings[i + 1]);
	}

	return (
		<>
			<Navbar />
			<div className="container">
				<button onClick={() => handleGetAccounts()}>
					Get Accounts + 3Box Testing
				</button>
				<div className="columns">
					<div className="column">
						{leftColumnListings.map((l, i) => (
							<MainListing key={i} listing={l}></MainListing>
						))}
					</div>
					<div className="column">
						{rightColumnListings.map((l, i) => (
							<MainListing key={i} listing={l}></MainListing>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function Listings() {
	return <p>testing</p>;
}

function Profile() {
	return <p>testing 2</p>;
}

function LockControls() {
	return (
		<section>
			<h1>LOCK CONTROLS:</h1>
			<button>Unlock</button>
			<button>Lock</button>
		</section>
	);
}

function Navbar() {
	return (
		<nav
			className="navbar is-light"
			role="navigation"
			aria-label="main navigation"
		>
			<a className="navbar-item" href="https://bulma.io">
				<img
					src="https://bulma.io/images/bulma-logo.png"
					width="112"
					height="28"
				></img>
			</a>
			<Link className="navbar-item" to="/">
				Home
			</Link>
			<Link className="navbar-item" to="/search">
				Search
			</Link>
			<div className="navbar-end">
				<Link className="navbar-item" to="/profile">
					<img src={profileImage} className="profile-img" />
				</Link>
			</div>
		</nav>
	);
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
