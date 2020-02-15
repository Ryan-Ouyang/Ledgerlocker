const express = require("express");
const cors = require("cors");
const app = express();

var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(cors());
app.use(express.json());

io.on("connection", function (socket) {
  console.log("Lock connected");
  socket.on('disconnect', function () {
    console.log('Lock disconnected');
  });
});

app.post("/api/unlock/", function (req, res) {
  io.sockets.emit("lockState", "unlock");
  res.send(200);
});

app.post("/api/lock/", function (req, res) {
  io.sockets.emit("lockState", "lock");
  res.send(200);
});

app.post("/api/changeID", function (req, res) {
  io.sockets.emit("idState", req);
  res.send(200);
});

app.get("/api/listings", function (req, res) {
  const listings = [
    {
      name: "House 1",

      address: "123 Broadway, Denver, CO",
      rent: "50 DAI",
      img:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Isaac_Bell_House_2018-06-13.jpg/1200px-Isaac_Bell_House_2018-06-13.jpg"
    },
    {
      name: "House 2",
      address: "253 11th St, Denver, CO",
      rent: "100 DAI",
      img:
        "https://www.trbimg.com/img-577423d8/turbine/ct-elite-street-sixteen-candles-evanston-home-for-sale-0630-biz-20160629"
    }
  ];

  res.send(listings);
});

server.listen(3001, () => console.log("API listening on port 3001"));
