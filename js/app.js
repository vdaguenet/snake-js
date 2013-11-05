var Server = require('./server.js').Server,
	Snake = require('./snake.js').Snake;

var server = new Server();
server.init(5000);

var snakes = {}; // snakes array

server.em.addListener('Snake.newSnake', function (snakeId) {
	var snake = new Snake();
	snake.init(snakeId);
	snakes[snakeId] = snake; // add the new snake in the array
});

server.em.addListener('Snake.disconnect', function (snakeId) {
    delete snakes[snakeId]; // delete snake from array
});

var tick = setInterval(function () {
	server.update(snakes);

	for ( var i in snakes) {
		snakes[i].doStep(); // Move the snake
	}
}, 100); // function executed every 100 ms
