import React from 'react';

import ParticlesBg from 'particles-bg';

import "./Dashboard.css";

export default function Dashboard() {
    const createListing = (id, price) => {
        var contract = new web3js.eth.Contract(contractABI, contractAddress);

        // FROM https://medium.com/coinmonks/ethereum-tutorial-sending-transaction-via-nodejs-backend-7b623b885707
        var count;
        // get transaction count, later will used as nonce
        web3js.eth.getTransactionCount(address).then(function (v) {
            console.log("Count: " + v);
            count = v;
            //creating raw tranaction
            var rawTransaction = {
                from: address,
                gasPrice: web3js.utils.toHex(60 * 10e9),
                gasLimit: web3js.utils.toHex(500000),
                to: contractAddress,
                value: "0x0",
                data: contract.methods.createListing(id, price).encodeABI(),
                nonce: web3js.utils.toHex(count)
            };
            console.log(rawTransaction);
            //creating tranaction via ethereumjs-tx
            var transaction = new Tx(rawTransaction, { chain: "kovan" });
            //signing transaction with private key
            transaction.sign(privateKeyHex);
            //sending transacton via web3js module
            web3js.eth
                .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
                .on("transactionHash", console.log)
                .on("receipt", console.log);
        });

        console.log("Listing created");
    };


    return (
        <div>
            <div className="mainDiv has-text-centered">
                <h1 className="mainTitle">Your interest</h1>
                <h1 className="bigText">Big Money here</h1>
            </div>
            <ParticlesBg type="polygon" bg={true} />
        </div>
    );
}