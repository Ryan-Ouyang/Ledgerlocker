const express = require('express');
const cors = require('cors');
const app = express();

var io =  require('socket.io')(http);

app.use(cors());
app.use(express.json());

io.on('connection', function(socket){
    console.log("LOCK CONNECTED")
})

app.post('/api/unlock/', function(req, res) {
    io.sockets.emit('open sesame', req);
})

app.post('/api/lock/', function(req, res) {
    io.sockets.emit('lock', req);
})

app.post('/api/changeID', function(req, res) {
    io.sockets.emit('change', req);
})

app.listen(3001, () => console.log("API listening on port 3001"));