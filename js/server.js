var Express = require('express'),
	http = require('http'),
	app = Express(),
	events = require('events'),
	io = require('socket.io');

// Export est l'équivalent de public (non dispo en JS)
// Le constructeur est placé dans la variable Server. Permet de ne pas réécrire exports à chaque méthode.
exports.Server = Server = function () {
	this.clientId = 1;
};

Server.prototype.init = function(port) {
	this.server = http.createServer(app);
	app.use(Express.static(__dirname + '/../public'));
	this.server.listen(port);
	this.em = new events.EventEmitter();
	this.startSockets();

	console.log('Server started, listening port : ' + port);
};

Server.prototype.startSockets = function () {
	this.socket = io.listen(this.server);

	this.socket.configure(function () {
		this.socket.set('log level', 1);
	}.bind(this)); // this de la closure = this du parent

	this.socket.of('/snake').on('connection', function (client) {
		client.snakeId = this.clientId;
		this.clientId++;
		console.log('Client #' + client.snakeId + ' is connected.');

		client.emit('response', {snakeId: client.snakeId});
		this.em.emit('Snake.newSnake', client.snakeId);

		client.on('disconnect', function () {
			console.log('Client #' + client.snakeId + ' disconnected.');
		});
	}.bind(this));
};

Server.prototype.update = function(snakes) {
	this.socket.of('/snake').emit('update', snakes);
};