import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import Box from "3box";
import axios from "axios";

import "bulma/css/bulma.css";
import "./App.css";

import MainListing from "./components/MainListing/MainListing";
import Owner from "./components/Owner/Owner";
import Navbar from "./components/Navbar/Navbar";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

const contractAddr = "0xE6023B2DaA371AB5fda43E12C4b2BbB86C0955f6";
const daiContractAddr = "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa";

const contractABI = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getListing",
		"outputs": [
			{
				"name": "_price",
				"type": "uint256"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_renter",
				"type": "address"
			},
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "vat",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "pot",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_seconds",
				"type": "uint256"
			}
		],
		"name": "setSecondsPerBlock",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "createVote",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTotalUserBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getWithdrawableBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAdminAccountBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getAccountBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "createListing",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "getFutureTimestamp",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "daiToken",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "daiJoin",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "bookListing",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "endListing",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_renter",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "listingBooked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_renter",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "listingClosed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
];
const daiContractABI = [
	{
		inputs: [
			{ internalType: "uint256", name: "chainId_", type: "uint256" }
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "src",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "guy",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "wad",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: true,
		inputs: [
			{
				indexed: true,
				internalType: "bytes4",
				name: "sig",
				type: "bytes4"
			},
			{
				indexed: true,
				internalType: "address",
				name: "usr",
				type: "address"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "arg1",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "arg2",
				type: "bytes32"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "LogNote",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "src",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "dst",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "wad",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		constant: true,
		inputs: [],
		name: "DOMAIN_SEPARATOR",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "PERMIT_TYPEHASH",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "address", name: "", type: "address" }
		],
		name: "allowance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "usr", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "approve",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [{ internalType: "address", name: "", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "usr", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "burn",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [{ internalType: "address", name: "guy", type: "address" }],
		name: "deny",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "usr", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "mint",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "src", type: "address" },
			{ internalType: "address", name: "dst", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "move",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [{ internalType: "address", name: "", type: "address" }],
		name: "nonces",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "holder", type: "address" },
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "nonce", type: "uint256" },
			{ internalType: "uint256", name: "expiry", type: "uint256" },
			{ internalType: "bool", name: "allowed", type: "bool" },
			{ internalType: "uint8", name: "v", type: "uint8" },
			{ internalType: "bytes32", name: "r", type: "bytes32" },
			{ internalType: "bytes32", name: "s", type: "bytes32" }
		],
		name: "permit",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "usr", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "pull",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "usr", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "push",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [{ internalType: "address", name: "guy", type: "address" }],
		name: "rely",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "dst", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "transfer",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{ internalType: "address", name: "src", type: "address" },
			{ internalType: "address", name: "dst", type: "address" },
			{ internalType: "uint256", name: "wad", type: "uint256" }
		],
		name: "transferFrom",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "version",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [{ internalType: "address", name: "", type: "address" }],
		name: "wards",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

// let addr = "";
let box;

export default function App() {
	const [listings, setListings] = useState([]);
	const [addr, setAddr] = useState("");
	const [contract, setContract] = useState();
	const [daiContract, setDaiContract] = useState();

	useEffect(() => {
		const fetchListings = async () => {
			const result = await axios("http://localhost:3001/api/listings");
			setListings(result.data);
			console.log("Fetched listings");
		};

		const loginUser = async () => {
			web3.eth.getAccounts().then(async address => {
				setAddr(address[0]);
				// addr = address[0]
				console.log("Address: ", address[0]);
				await open3Box(address[0]);
				await set3BoxData("testing", "value");
				await get3BoxData("testing");
				await remove3BoxData("testing");
				web3.eth.defaultAccount = `${address[0]}`;
			});
		};

		const instantiateContracts = async () => {
			const instance = new web3.eth.Contract(
				contractABI,
				contractAddr
			);
			setContract(instance);
			console.log("Contract instantiated");
			const daiInstance = new web3.eth.Contract(
				daiContractABI,
				daiContractAddr
			);
			console.log("DAI Contract instantiated");
			setDaiContract(daiInstance);
		};

		fetchListings();
		loginUser();
		instantiateContracts();
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
					<Route exact path="/">
						<Home
							listings={listings}
							addr={addr}
							contract={contract}
							daiContract={daiContract}
						/>
					</Route>
					<Route path="/listings">
						<Listings />
					</Route>
					<Route path="/profile">
						<Profile />
					</Route>
					<Route path="/owner">
						<Owner />
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
			<Navbar addr={props.addr} />
			<div className="container home-container">
				<div className="columns">
					<div className="column">
						{leftColumnListings.map((l, i) => (
							<MainListing
								key={i}
								listing={l}
								contract={props.contract}
								daiContract={props.daiContract}
								addr={props.addr}
							></MainListing>
						))}
					</div>
					<div className="column">
						{rightColumnListings.map((l, i) => (
							<MainListing
								key={i}
								listing={l}
								contract={props.contract}
								daiContract={props.daiContract}
								addr={props.addr}
							></MainListing>
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

async function open3Box(addr) {
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
