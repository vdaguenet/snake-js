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

// Initialization of server
Server.prototype.init = function(port) {
	this.server = http.createServer(app);
	app.use(Express.static(__dirname + '/../public'));
	this.server.listen(port);
	this.em = new events.EventEmitter();
	this.startSockets();

	console.log('Server started, listening port : ' + port);
};

// Initialization of sockets
Server.prototype.startSockets = function () {
	this.socket = io.listen(this.server); // the socket listen the server

	this.socket.configure(function () {
		this.socket.set('log level', 1); // set the log level
	}.bind(this)); // this closure = this parent

	this.socket.of('/snake').on('connection', function (client) { // Set snakeId on each client connection
		client.snakeId = this.clientId; 
		this.clientId++;
		console.log('Client #' + client.snakeId + ' is connected.');

		client.emit('response', {snakeId: client.snakeId}); // Send response to client
		this.em.emit('Snake.newSnake', client.snakeId);

		client.on('disconnect', function () { // Disconnection to dont have a new client on every refresh
			console.log('Client #' + client.snakeId + ' disconnected.');
			this.em.emit('Snake.disconnect', client.snakeId);
		}.bind(this));
	}.bind(this));
};

Server.prototype.update = function(snakes) {
	this.socket.of('/snake').emit('update', snakes);
};