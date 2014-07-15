/**
* Includes
*/
var Express = require('express'),
	http = require('http'),
	app = Express(),
	events = require('events'),
	io = require('socket.io');

// Export is equivalent to public (unavailable in JS)
// Variable Server contains the constructor for not rewrite 'exports' before each method
exports.Server = Server = function () {
	this.clientId = 1;
};

/**
* Server initialization
*/
Server.prototype.init = function(port) {
	this.server = http.createServer(app);
	app.use(Express.static(__dirname + '/../public'));
	this.server.listen(port);
	this.em = new events.EventEmitter();
	this.startSockets();

	console.log('Server started, listening port : ' + port);
};

/**
* Sockets settings
*/
Server.prototype.startSockets = function () {
	// the socket listen the server
	this.socket = io.listen(this.server); 
	
	// Set snakeId on each client connection
	this.socket.of('/snake').on('connection', function (client) { 
		client.snakeId = this.clientId; 
		this.clientId++;
		console.log('Client #' + client.snakeId + ' is connected.');
		
		// Send response to client
		client.emit('response', {snakeId: client.snakeId}); 
		this.em.emit('Snake.newSnake', client.snakeId);
		
		// Disconnection to dont have a new client on every refresh
		client.on('disconnect', function () { 
			this.em.emit('Snake.disconnect', client.snakeId);
			console.log('Client #' + client.snakeId + ' disconnected.');
		}.bind(this));
		
		// get direction from client.js
		client.on('movement', function (direction) { 
			// Send the direction chose by client to app.js
			this.em.emit('Snake.movement', {direction : direction, snakeId: client.snakeId}); 
		}.bind(this));

	}.bind(this));
};

/**
* Event to drow canvas with all elements present
*/
Server.prototype.update = function(snakes, bonuses, bombs) {
	this.socket.of('/snake').emit('update', snakes, bonuses, bombs);
};