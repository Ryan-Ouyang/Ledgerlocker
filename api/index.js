const express = require("express");
const cors = require("cors");
const app = express();

var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(cors());
app.use(express.json());

var locked; //true for locked
var doorClosed; //true for closed

io.on("connection", function (socket) {
  console.log("Lock connected");
  socket.on('postLock', function (value) {
    console.log("Lock: " + value);
    locked = value;
  });
  socket.on('postDoor', function (value) {
    console.log("Door: " + value);
    doorClosed = value;
  });
  socket.on('disconnect', function () {
    console.log('Lock disconnected');
  });
});

app.post("/api/unlock/", function (req, res) {
  if (locked === "locked") {
    io.sockets.emit("lockState", "unlock");
    res.send(200);
  }
});

app.post("/api/lock/", function (req, res) {
  if (locked === "unlocked") {
    io.sockets.emit("lockState", "lock");
    res.send(200);
  }
});

app.post("/api/changeID", function (req, res) {
  io.sockets.emit("idState", req.body.id);
  res.send(200);
});

app.get("/api/listings", function (req, res) {
  const listings = [
    {
      name: "Lovely Micro-Studio in Forest Park, GA",
      id: 1,
      address: "Forest Park, GA",
      rent: "45 DAI/day",
      stake: 2,
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
      name: "Cosy Apartment in Denver, CO",
      id: 2,
      address: "Denver, CO",
      rent: "50 DAI/day",
      stake: 2,
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
    }
  ];

  res.send(listings);
});

server.listen(3001, () => console.log("API listening on port 3001"));
