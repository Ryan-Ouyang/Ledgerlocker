import React, { useState, useEffect } from "react";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import Box from "3box";
import axios from "axios";

import MainListing from "../MainListing/MainListing";
import Navbar from "../Navbar/Navbar";

import contractABI from "../../abis/contract";
import daiContractABI from "../../abis/dai";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

let box;
let space;

let spaceName = "ledgerlocker-test1";

const contractAddr = "0xE6023B2DaA371AB5fda43E12C4b2BbB86C0955f6";
const daiContractAddr = "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa";

export default function Home(props) {
  const [listings, setListings] = useState([]);
  const [addr, setAddr] = useState("");
  const [contract, setContract] = useState();
  const [daiContract, setDaiContract] = useState();

  useEffect(() => {
    const loginUser = async () => {
      web3.eth.getAccounts().then(async address => {
        setAddr(address[0]);
        // addr = address[0]
        console.log("Address: ", address[0]);
        await open3Box(address[0]);
        web3.eth.defaultAccount = `${address[0]}`;
      });
    };

    loginUser();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const result = await axios("http://localhost:3001/api/listings");
      setListings(result.data);
      console.log("Fetched listings");
    };

    const instantiateContracts = async () => {
      const instance = new web3.eth.Contract(contractABI, contractAddr);
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
    instantiateContracts();
  }, []);

  const leftColumnListings = [];
  const rightColumnListings = [];

  // For flowing two columns
  for (let i = 0; i < listings.length; i += 2) {
    leftColumnListings.push(listings[i]);
    rightColumnListings.push(listings[i + 1]);
  }

  return (
    <>
      <Navbar addr={addr} />
      <div className="container home-container">
        <div className="columns">
          <div className="column">
            {leftColumnListings.map((l, i) => (
              <MainListing
                key={i}
                listing={l}
                contract={contract}
                daiContract={daiContract}
                addr={addr}
              ></MainListing>
            ))}
          </div>
          <div className="column">
            {rightColumnListings.map((l, i) => (
              <MainListing
                key={i}
                listing={l}
                contract={contract}
                daiContract={daiContract}
                addr={addr}
              ></MainListing>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

async function open3Box(addr) {
  box = await Box.openBox(addr, fm.getProvider());
  space = await box.openSpace(spaceName);
  await box.syncDone;
  await space.syncDone;
  console.log("Opened 3box box for ", addr);
}

async function set3BoxData(key, value) {
  await space.private.set(key, value);
  console.log("Set private value in 3box (key: ", key, ")");
}

async function get3BoxData(key) {
  await space.private.get(key);
  console.log("Got private value in 3box (key: ", key, ")");
}

async function remove3BoxData(key) {
  await space.private.remove(key);
  console.log("Removed private value in 3box (key: ", key, ")");
}
