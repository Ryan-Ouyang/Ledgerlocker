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

const contractAddr = "0xA8AfBbb79Aa49EC8778a8A6e44D40630Ef327500";
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
    if (listings[i] != null) {
      leftColumnListings.push(listings[i]);
    }

    if (listings[i + 1] != null) {
      rightColumnListings.push(listings[i + 1]);
    }
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
