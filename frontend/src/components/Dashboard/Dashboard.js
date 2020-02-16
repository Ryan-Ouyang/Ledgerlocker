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
  const contractAddr = "0x754cEd19DaC5e791Fe989281747771F38626C9DC";

  const instance = new web3.eth.Contract(contractABI, contractAddr);
  console.log("Contract instantiated");
  instance.methods
    .balance()
    .call()
    .then(response => setBalance(response));
  setInterval(
    instance.methods
      .getAdminAccountBalance()
      .call()
      .then(response => setAdminBalance(response)),
    5000
  );

  return (
    <div>
      <div className="mainDiv has-text-centered">
        <h1 className="mainTitle">Your interest</h1>
        <h1 className="bigText">{adminBalance}</h1>
      </div>
      <ParticlesBg type="polygon" bg={true} />
    </div>
  );
}
