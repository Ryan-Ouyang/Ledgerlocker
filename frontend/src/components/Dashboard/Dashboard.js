import React, { useState } from "react";
import Web3 from "web3";

import ParticlesBg from "particles-bg";
import "./Dashboard.css";

import contractABI from "../../abis/contract";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [adminBalance, setAdminBalance] = useState(0);
  const web3 = new Web3(
    "https://kovan.infura.io/v3/b08e31ca292b465d8ddb30d57921c756"
  );
  const contractAddr = "0xA8AfBbb79Aa49EC8778a8A6e44D40630Ef327500";

  const instance = new web3.eth.Contract(contractABI, contractAddr);
  console.log("Contract instantiated");

  setInterval(function () {
    instance.methods
      .getAdminAccountBalance()
      .call()
      .then(response => setAdminBalance(response));
  }, 5000);

  setInterval(function () {
    instance.methods
      .balance()
      .call()
      .then(response => setBalance(response));
  }, 5000);


  return (
    <div>
      <div className="mainDiv has-text-centered">
        <h1 className="mainTitle">Your interest</h1>
        <h1 className="bigText">${web3.utils.fromWei(adminBalance.toString(), 'ether')}</h1>
        <h1 className="mainTitle">Your contract balance</h1>
        <h1 className="bigText">${web3.utils.fromWei(balance.toString(), 'ether')}</h1>
      </div>
      <ParticlesBg type="polygon" bg={true} />
    </div>
  );
}
