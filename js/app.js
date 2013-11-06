var Server = require('./server.js').Server,
	Snake = require('./snake.js').Snake,
	Bonus = require('./bonus.js').Bonus;

var server = new Server();
server.init(5000);

var snakes = {}, // snakes array
 	bonuses = []; // bonus array

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
	var resetSnakes = [];

	for (var s1 in snakes) { // Go on all snakes
		for (var s2 in snakes) { // Current snake go on all snakes
			for (var i = 0; i < snakes[s2].currentLength-1; i++) { // Go on all s2's element
				if (snakes[s1].id == snakes[s2].id && i == snakes[s2].currentLength-1) { // When s1 compare to its head
					continue;
				}
				if (snakes[s1].hasColision(snakes[s2].elements[i])) { // s1 touch s2
					resetSnakes.push(snakes[s1]); // save snake in array 
					snakes[s2].kills++;
				}
			}
		}

		for (var j in bonuses) {
			if (snakes[s1].hasColision(bonuses[j])) { // s1 touch a bonus
				bonuses[j].onTouch(snakes[s1]);
				bonuses.splice(j, 1);
				
				break;
			}	
		}
	}

	// Kill the snakes
	for (var i in resetSnakes) {
		resetSnakes[i].onDie();
	}
}

var tick = setInterval(function () {
	for ( var i in snakes) {
		snakes[i].doStep(); // Move the snake
	}
	checkColisions();
	server.update(snakes, bonuses);
}, 100); // function executed every 100 ms

var tick_bonus = setInterval(function () {
	bonuses.push(new Bonus());

	server.update(snakes, bonuses);
}, 3000); // add new bonus eah 3s