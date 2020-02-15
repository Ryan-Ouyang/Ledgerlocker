import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Fortmatic from 'fortmatic';
import Web3 from 'web3';

const fm = new Fortmatic('pk_test_C0C9ADE8AD6C86A9');
let web3 = new Web3(fm.getProvider());

let handleGetAccounts = () => {
  web3.eth.getAccounts().then(console.log);
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
    <button onClick={() => handleGetAccounts()}>web3.eth.getAccounts</button>
  );
}

function About() {
	return <h2>About</h2>;
}

function Users() {
	return <h2>Users</h2>;
}
