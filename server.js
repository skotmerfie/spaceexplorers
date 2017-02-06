var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var common = require('./models/common');
var vector = require('./models/vector');
var ship = require('./models/ship');
var bullet = require('./models/bullet');
var space = require('./models/space');

// Configure the web server portion of the node application
http.listen(process.env.PORT || 8888);
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

// global variables
var stateOfSpace = new space();
var clients = {};

// client socket communications
io.on('connection', function (socket) {
	clients[socket.id] = socket;
	stateOfSpace.addShip(socket.id.substr(2));

	socket.on('disconnect', function () {
		clients[socket.id] = null;
	});
	socket.on('steer', function(keys) {
		stateOfSpace.setShipControls(socket.id.substr(2), keys);
	});
	socket.on('fire', function() {
		stateOfSpace.shipFiredBullet(socket.id.substr(2));
	});
});

// game engine tick and emit results to all clients
function gameTick() {
	stateOfSpace.tick();
	for (var c in clients) {
		if (clients[c] !== null)
			clients[c].emit('tick', stateOfSpace);
	}
}
setInterval(gameTick, 50);