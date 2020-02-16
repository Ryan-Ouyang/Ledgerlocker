const express = require("express");
const cors = require("cors");
const app = express();
const { request } = require("graphql-request");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const web3 = require("web3");

const Tx = require("ethereumjs-tx").Transaction;

// Admin user
const privateKey =
  "d72c3e39f07665c8594ed6354d9c3f528f501fa8bda627be548c1ace7b3dc28e";
const address = "0xA5A4E75ED687E45deC203abB3b1a14516D1078D0";

// Contract info
const privateKeyHex = Buffer.from(privateKey, "hex");

const contractAddress = "0xc021D5C58D92d24411EFa29aA7F72fC9bb2B707C";

const contractABI = require("./abi");
let listings = require("./listings");

web3js = new web3(
  "https://kovan.infura.io/v3/b08e31ca292b465d8ddb30d57921c756"
);

const createListing = (id, price) => {
  var contract = new web3js.eth.Contract(contractABI, contractAddress);

  web3js.eth.getBalance(address, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(web3.utils.fromWei(result, "ether") + " ETH");
    }
  });

  // FROM https://medium.com/coinmonks/ethereum-tutorial-sending-transaction-via-nodejs-backend-7b623b885707
  var count;
  // get transaction count, later will used as nonce
  web3js.eth.getTransactionCount(address).then(function(v) {
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

const graphQLQuery = `{
  listings {
    id
    listingId
    price
    booked
    renter
    owner
    eventType
  }
}
`;

app.use(cors());
app.use(express.json());

var locked;
var doorClosed;
var lockCode;

io.on("connection", function(socket) {
  console.log("Lock connected. Sending new code...");
  var val = Math.floor(1000 + Math.random() * 9000);
  lockCode = val;
  //io.sockets.emit("idState", val);
  io.sockets.emit("idstate", "9786");
  console.log("Sent code ", val);

  socket.on("postLock", function(value) {
    console.log("Lock: " + value);
    locked = value; //locked or unlocked
  });

  socket.on("postDoor", function(value) {
    console.log("Door: " + value);
    doorClosed = value; // closed or open
  });

  socket.on("disconnect", function() {
    console.log("Lock disconnected");
  });
});

app.post("/api/unlock/", function(req, res) {
  if (locked === "locked") {
    io.sockets.emit("lockState", "unlock");
    res.sendStatus(200);
  }
});

app.get("/api/lockCode", function(req, res) {
  res.send({ code: lockCode });
});

app.post("/api/lock/", function(req, res) {
  if (locked === "unlocked" && doorClosed === "closed") {
    io.sockets.emit("lockState", "lock");
    res.sendStatus(200);
  }
});

app.post("/api/changeID", function(req, res) {
  var val = Math.floor(1000 + Math.random() * 9000);
  lockCode = val;
  io.sockets.emit("idState", val);
  res.sendStatus(200);
});

app.post("/api/checkout", function(req, res) {
  listings[req.body.id].booked = false;
  listings[req.body.id].renter = "0x0000000000000000000000000000000000000000";
  res.sendStatus(200);
});

app.get("/api/listings/booked", async function(req, res) {
  var data = await request(
    "https://api.thegraph.com/subgraphs/name/haardikk21/ledgerlocker",
    graphQLQuery
  );

  var _listings = [];

  data.listings.forEach(listing => {
    if (listing.eventType === "booking") {
      if (listings[listing.listingId].booked == true) {
        _listings.push(listing);
      }
    }
  });

  res.json(_listings);
});

app.get("/api/listings", async function(req, res) {
  var data = await request(
    "https://api.thegraph.com/subgraphs/name/haardikk21/ledgerlocker",
    graphQLQuery
  );

  var _listings = [];

  data.listings.forEach(listing => {
    if (listing.eventType == "creating") {
      if (listings[listing.listingId].booked == false) {
        _listings.push(listings[listing.listingId]);
      }
    }
  });
  res.json(_listings);
});

app.post("/api/book", async function(req, res) {
  listings[req.body.id].booked = true;
  listings[req.body.id].renter = req.body.renter;
  res.sendStatus(200);
});

app.get("/api/createListing/:id/", async function(req, res) {
  createListing(req.params.id, `${listings[req.params.id].price * 10e18}`);
  listings[req.params.id].created = true;
  listings[req.params.id].owner = address;
  res.sendStatus(200);
});

server.listen(3001, () => console.log("API listening on port 3001"));
