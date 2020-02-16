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

// let addr = "";
let box;

export default function App() {
  const contractABI = [
    {
      constant: false,
      inputs: [
        {
          name: "_id",
          type: "uint256"
        }
      ],
      name: "bookListing",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_id",
          type: "uint256"
        },
        {
          name: "_price",
          type: "uint256"
        },
        {
          name: "_duration",
          type: "uint256"
        }
      ],
      name: "createListing",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_id",
          type: "uint256"
        }
      ],
      name: "endListing",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_seconds",
          type: "uint256"
        }
      ],
      name: "setSecondsPerBlock",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_id",
          type: "uint256"
        }
      ],
      name: "listingBooked",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_id",
          type: "uint256"
        }
      ],
      name: "listingClosed",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      constant: true,
      inputs: [],
      name: "balance",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "daiJoin",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "daiToken",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_address",
          type: "address"
        }
      ],
      name: "getAccountBalance",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_duration",
          type: "uint256"
        }
      ],
      name: "getFutureTimestamp",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_id",
          type: "uint256"
        }
      ],
      name: "getListing",
      outputs: [
        {
          name: "_price",
          type: "uint256"
        },
        {
          name: "_timestamp",
          type: "uint256"
        },
        {
          name: "_renter",
          type: "address"
        },
        {
          name: "_owner",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_address",
          type: "address"
        }
      ],
      name: "getWithdrawableBalance",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "isOwner",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "pot",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "vat",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    }
  ];

  const [listings, setListings] = useState([]);
  const [addr, setAddr] = useState("");
  const [contract, setContract] = useState();

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
      });
    };

    const instantiateContract = async () => {
      const instance = new web3.eth.Contract(
        contractABI,
        "0xD0B9B721279E0F0c11c4c750f3530661097F016c"
      );
      setContract(instance);
      console.log("Contract instantiated");
    };

    fetchListings();
    loginUser();
    instantiateContract();
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
            <Home listings={listings} addr={addr} contract={contract} />
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
              ></MainListing>
            ))}
          </div>
          <div className="column">
            {rightColumnListings.map((l, i) => (
              <MainListing
                key={i}
                listing={l}
                contract={props.contract}
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
