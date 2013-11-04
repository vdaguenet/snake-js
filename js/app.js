var Server = require('./server.js').Server,
	Snake = require('./snake.js').Snake;

var server = new Server(); // instancie le serveur.
server.init(5000);

var snakes = {};

server.em.addListener('Snake.newSnake', function (snakeId) {
	var snake = new Snake();
	snake.init(snakeId);
	snakes[snakeId] = snake;
});

var tick = setInterval(function () {
	server.update(snakes);
}, 100); // la fonction sera executée toute les 100 ms
