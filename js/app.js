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

server.em.addListener('Snake.movement', function (data) {
    snakes[data.snakeId].setDirection(data.direction); // Change direction of snake
});

function checkColisions () {
	
	for (var s1 in snakes) { // Go on all snakes
		for (var s2 in snakes) { // Current snake go on all snakes
			for (var i = 0; i < snakes[s2].currentLength-1; i++) { // Go on all s2's element
				if (snakes[s1].hasColision(snakes[s2].elements[i])) { // s1 touch s2 => s1 die
					snakes[s1].onDie();
				}
			}
		}
	}
}

var tick = setInterval(function () {
	server.update(snakes);

	for ( var i in snakes) {
		snakes[i].doStep(); // Move the snake
	}

	checkColisions();
}, 100); // function executed every 100 ms

