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
const contractABI = [
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
    inputs: [],
    name: "createVote",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getTotalUserBalance",
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
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
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
    name: "getAdminAccountBalance",
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
    constant: false,
    inputs: [
      {
        name: "_id",
        type: "uint256"
      },
      {
        name: "_price",
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
    constant: false,
    inputs: [
      {
        name: "_id",
        type: "uint256"
      },
      {
        name: "_duration",
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
      }
    ],
    name: "endListing",
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
      },
      {
        indexed: false,
        name: "_price",
        type: "uint256"
      },
      {
        indexed: false,
        name: "_timestamp",
        type: "uint256"
      },
      {
        indexed: false,
        name: "_renter",
        type: "address"
      },
      {
        indexed: false,
        name: "_owner",
        type: "address"
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
      },
      {
        indexed: false,
        name: "_price",
        type: "uint256"
      },
      {
        indexed: false,
        name: "_timestamp",
        type: "uint256"
      },
      {
        indexed: false,
        name: "_renter",
        type: "address"
      },
      {
        indexed: false,
        name: "_owner",
        type: "address"
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
  }
];
const contractAddress = "0x55A2718325b19B5373EB078403ad9f8B113eB51f";

// web3js = new web3("https://shared-parity-kovan.nodes.deploy.radar.tech/?apikey=aa471b3aef7702ef45419b6b784f0dfc7d7575f01fef1cab");
web3js = new web3(
  "https://kovan.infura.io/v3/b08e31ca292b465d8ddb30d57921c756"
);

const createListing = (id, price) => {
  var contract = new web3js.eth.Contract(contractABI, contractAddress);

  web3js.eth.getBalance("0xA5A4E75ED687E45deC203abB3b1a14516D1078D0", function(
    err,
    result
  ) {
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
    timestamp
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
  io.sockets.emit("idState", val);
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

app.post("/api/checkin", function(req, res) {
  res.sendStatus(200);
});

app.post("/api/checkout", function(req, res) {
  res.sendStatus(200);
});

app.get("/api/listings/booked", async function(req, res) {
  var data = await request(
    "https://api.thegraph.com/subgraphs/name/haardikk21/ledgerlocker",
    graphQLQuery
  );

  var listings = [];

  data.listings.forEach(listing => {
    if (listing.eventType === "booking") {
      listings.push(listing);
    }
  });

  res.json(listings);
});

app.get("/api/listings", function(req, res) {
  const listings = [
    {
      name: "Lovely Micro-Studio in Forest Park, GA",
      id: 1,
      address: "Forest Park, GA",
      rent: 45,
      booked: true,
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "123 Broadway, Denver near ABC Mall. Walking score 95, with everything you can want within 5 minutes walking distance. House was just renovated and has hardwood floors, new kitchen appliances, and renovated bathrooms. A great place to call it your home!",

      images: [
        "https://www.padsplit.com/img/rooms/room_866_0_1578610474.769763.jpg",
        "https://www.padsplit.com/img/rooms/room_866_1_1578610474.769763.jpg",
        "https://www.padsplit.com/img/psproperty/psproperty_158_4_1578610474.769763.jpg",
        "https://www.padsplit.com/img/psproperty/psproperty_158_3_1578610474.769763.jpg",
        "https://www.padsplit.com/img/psproperty/psproperty_158_2_1578610474.769763.jpg",
        "https://www.padsplit.com/img/psproperty/psproperty_158_1_1578610474.769763.jpg",
        "https://www.padsplit.com/img/psproperty/psproperty_158_0_1578610474.769763.jpg"
      ]
    },
    {
      name: "Historic Carriage House in Denver's Oldest Neighborhood",
      id: 2,
      address: "Denver, CO",
      rent: 50,
      booked: true,
      renter: "0xd02b00EFd6E38d7735C7b1793edD6379E8BF5efB",
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "Prepare to be charmed by the exposed brickwork and quirky decor of this lovely historic home that once sheltered horses in the late 1800s. It's been featured in Architectural Digest online as Colorado's most unique and beautiful Airbnb property.",
      images: [
        "https://a0.muscache.com/4ea/air/v2/pictures/8a093f7e-d602-4487-9399-c2daa11fcc2e.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/877a6b3f-aaa6-4cd0-9452-0a5cd21ce09a.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/d50e1732-4bb0-4121-8636-4e86dd87066c.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/9e2d6a5c-f0a7-45ea-a5fd-540cce73256a.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/f0e796f0-9fe9-4c6f-a2ab-9ad007a675a9.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90"
      ]
    },
    {
      name: "❤️Capital Hill Loft Style Apt Hot Tub",
      id: 2,
      address: " 1375 Corona St, Denver, Colorado",
      rent: "25 DAI/day",
      booked: false,
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "Beautiful basement apartment in 1890 Victorian home. Just added brand new furniture in living room. Enter through a courtyard with Koi pond. Walking distance to everything; Ogden, Fillmore, Bluebird, 16th st mall, nightlife, restaurants, min. from Denver Pavilion. Kitchen Bike Rental Hot Tub Laundry. Includes one off-street parking spot for guests. We do get booked in advance so book now!",
      images: [
        "https://a0.muscache.com/im/pictures/352e9a77-44ca-484f-92aa-fe50d2444265.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/aa339798-9600-4003-bb0f-e0205d1f5274.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/51f34cad-4bbe-4b9a-a3b9-23e45a2a1206.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/d6cfba23-c73e-4ca9-85d2-4083acb0b07d.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/cf0871f7-4070-4b88-bc1d-5e10735a1a0d.jpg?aki_policy=large"
      ]
    },
    {
      name: "Bungalow B",
      id: 2,
      address: "900 Osceola St, Denver, Colorado",
      rent: "50 DAI/day",
      booked: false,
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "Private studio/loft 1 bedroom home in the Villa Park neighborhood adjacent to Downtown Denver. Perry Street Light Rail station is 2.5 blocks away. Less than 5 miles from either Union Station in the center of Denver or the Denver Federal Center in Lakewood, CO. Easily connect to I-70 for access to the mountains for skiing/hiking or just sightseeing. Feet away from running/bike trail that leads into Denver or minutes from Sloan’s Lake for running/biking/boating.",
      images: [
        "https://a0.muscache.com/im/pictures/d123969e-c359-4402-95bf-1868c1bba06c.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/90edf3cc-1fd2-4b37-98ae-1fc41be0dcbe.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/e70ce887-3f6c-49ae-90c1-91681d1bc49e.jpg?aki_policy=large"
      ]
    },
    {
      name: "Private Guesthouse - Live Like a Local",
      id: 2,
      address: "3994 S Lincoln St, Englewood, Colorado",
      rent: "55 DAI/day",
      booked: false,
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "Close to everything Denver has to offer—easy access to Colorado's beautiful mountains and thriving downtown! Private studio guesthouse with designated off-street parking located on South Broadway in a quiet neighborhood near downtown Englewood. 10 minute drive to downtown Denver. Close to the Gothic Theater, Red Rocks, bars, restaurants, dispensaries, hiking and the light rail. We are 420 friendly. There is 1 queen bed and 1 sofa bed. Not a full kitchen—but has mini fridge and coffee maker.",
      images: [
        "https://a0.muscache.com/im/pictures/c6e4c693-1b0e-402a-8efb-3d4fdb9b893c.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/2002ba0c-5161-4ad8-bd99-519442c8f03e.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/b7c9c07a-cc67-49c3-87cd-03cd63cf1ffe.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/a849febe-57d4-4eeb-8820-57129adb72c8.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/6b140b15-592d-4b1a-b48e-fb5724def298.jpg?aki_policy=xx_large"
      ]
    },
    {
      name: "Mountain Views, Entertainment Galore!",
      id: 2,
      address: "5200 W 51st Ave, Denver, Colorado",
      rent: "85 DAI/day",
      booked: false,
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "An enjoyable home for your next visit to Denver. Enjoy mountain views, watch a movie on the home theater, or kick back in a secluded hot tub surrounded by pine trees. Located near Regis University, Tennyson Shopping District, Olde Towne Arvada, and Inspiration Point Park. Easy access to I-70 means just 25 minutes to the airport and 10 minutes to downtown Denver. We have an energetic 1.5 year old, you may hear some noises during the day, but night-time disturbances are few.",
      images: [
        "https://a0.muscache.com/im/pictures/61c9dece-c487-42e7-b58f-276a48eb2cd9.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/71ab2bea-24db-41ff-9c32-82d3e9e3d62e.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/5c319b60-1d04-4968-aff9-3ffdbef37c40.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/9e6ab16c-77c8-4445-95eb-bf56ceadcab4.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/8369aadc-55d2-439c-9f41-c7b97861350c.jpg?aki_policy=large"
      ]
    },
    {
      name: "Private Guesthouse - Live Like a Local",
      id: 2,
      address: "1015 21st St, Denver, Colorado",
      rent: "80 DAI/day",
      booked: false,
      stake: 2,
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "Hip 3 Level space is in the middle of it ALL! Modern with a charming feel. Right by Coors, Union Station, fantastic restaurants, music whatever your heart desires. Enjoy the comforts of home and of the city of Denver. Check in can usually be 1pm but may not be cleaned until 5pm.",
      images: [
        "https://a0.muscache.com/im/pictures/0f69fdb1-bbfd-4b79-8d8b-25d19e35f37c.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/b4c2c44b-7aa3-43d4-8f3a-1fcf53224ffb.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/4e238c27-72c7-4e66-9d04-2fa538fdfe1b.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/d81c051d-f048-4562-9c03-3eb8b0f8f572.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/0b50497e-4dad-4437-9fc7-5609ae55188e.jpg?aki_policy=large"
      ]
    },
    {
      name: "Historic Carriage House in Denver's Oldest Neighborhood",
      id: 3,
      address: "55 East 31st Avenue, Denver, CO",
      rent: 50,
      booked: false,
      stake: 2,
      renter: "0x0000000000000000000000000000000000000000",
      owner: "0xd02b00EFd6E38d7735C7b1793edD6379E8BF5efB",
      description:
        "Prepare to be charmed by the exposed brickwork and quirky decor of this lovely historic home that once sheltered horses in the late 1800s. It's been featured in Architectural Digest online as Colorado's most unique and beautiful Airbnb property.",
      images: [
        "https://a0.muscache.com/4ea/air/v2/pictures/8a093f7e-d602-4487-9399-c2daa11fcc2e.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/877a6b3f-aaa6-4cd0-9452-0a5cd21ce09a.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/d50e1732-4bb0-4121-8636-4e86dd87066c.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/9e2d6a5c-f0a7-45ea-a5fd-540cce73256a.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/f0e796f0-9fe9-4c6f-a2ab-9ad007a675a9.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90"
      ]
    },
    {
      name: "Historic Carriage House in Denver's Oldest Neighborhood",
      id: 4,
      address: "55 East 31st Avenue, Denver, CO",
      rent: 50,
      booked: false,
      renter: "0x0000000000000000000000000000000000000000",
      stake: 2,
      owner: "0xd02b00EFd6E38d7735C7b1793edD6379E8BF5efB",
      description:
        "Prepare to be charmed by the exposed brickwork and quirky decor of this lovely historic home that once sheltered horses in the late 1800s. It's been featured in Architectural Digest online as Colorado's most unique and beautiful Airbnb property.",
      images: [
        "https://a0.muscache.com/4ea/air/v2/pictures/8a093f7e-d602-4487-9399-c2daa11fcc2e.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/877a6b3f-aaa6-4cd0-9452-0a5cd21ce09a.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/d50e1732-4bb0-4121-8636-4e86dd87066c.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/9e2d6a5c-f0a7-45ea-a5fd-540cce73256a.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90",
        "https://a0.muscache.com/4ea/air/v2/pictures/f0e796f0-9fe9-4c6f-a2ab-9ad007a675a9.jpg?t=r:w2500-h1500-sfit,e:fjpg-c90"
      ]
    },
    {
      name: "❤️Capital Hill Loft Style Apt Hot Tub",
      id: 5,
      address: "1375 Corona St, Denver, Colorado",
      rent: 25,
      booked: false,
      stake: 2,
      renter: "0x0000000000000000000000000000000000000000",
      owner: "0xed7c62124138144e42ddd57dd4cd20e9416a688f",
      description:
        "Beautiful basement apartment in 1890 Victorian home. Just added brand new furniture in living room. Enter through a courtyard with Koi pond. Walking distance to everything; Ogden, Fillmore, Bluebird, 16th st mall, nightlife, restaurants, min. from Denver Pavilion. Kitchen Bike Rental Hot Tub Laundry. Includes one off-street parking spot for guests. We do get booked in advance so book now!",
      images: [
        "https://a0.muscache.com/im/pictures/352e9a77-44ca-484f-92aa-fe50d2444265.jpg?aki_policy=xx_large",
        "https://a0.muscache.com/im/pictures/aa339798-9600-4003-bb0f-e0205d1f5274.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/51f34cad-4bbe-4b9a-a3b9-23e45a2a1206.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/d6cfba23-c73e-4ca9-85d2-4083acb0b07d.jpg?aki_policy=large",
        "https://a0.muscache.com/im/pictures/cf0871f7-4070-4b88-bc1d-5e10735a1a0d.jpg?aki_policy=large"
      ]
    }
  ];

  res.send(listings);
});

app.get("/api/createListing/:id/:price", async function(req, res) {
  createListing(req.params.id, req.params.price);
});

server.listen(3001, () => console.log("API listening on port 3001"));
