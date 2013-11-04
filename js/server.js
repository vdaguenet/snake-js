var Express = require('express'),
	http = require('http'),
	app = Express();

// Export est l'équivalent de public (non dispo en JS)
// Le constructeur est placé dans la variable Server. Permet de ne pas réécrire exports à chaque méthode.
exports.Server = Server = function () {

};

Server.prototype.init = function(port) {
	this.server = http.createServer(app);
	app.use(Express.static(__dirname + '/../public'));
	this.server.listen(port);

	console.log('Server started, listening port : ' + port);
};