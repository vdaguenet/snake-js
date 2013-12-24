var Server = require('./server.js').Server,
	Snake = require('./snake.js').Snake,
	Bomb = require('./bomb.js').Bomb,
	Portal = require('./portal.js').Portal,
	Bonus = require('./bonus.js').Bonus;

var server = new Server();
server.init(5000);

var snakes = {}, // snakes array
 	bonuses = [],
 	bombs = []; // bonus array

createBonuses();

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
					if (snakes[s1].id != snakes[s2].id ) { // When s1 kills itself
						snakes[s2].onKill();
					}
				}
			}
		}

		for (var j in bonuses) {
			if (snakes[s1].hasColision(bonuses[j])) { // s1 touch a bonus
				bonuses[j].onTouch(snakes[s1]);
				break;
			}	
		}

		for (var k in bombs) {
			if (snakes[s1].hasColision(bombs[k])) { // s1 touch a bonus
				bombs[k].onTouch(snakes[s1]);
				bombs.splice(j, 1);
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
	server.update(snakes, bonuses, bombs);
}, 100); // function executed every 100 ms

function createBonuses() { // Init bonuses
	for (var i = 0; i < 2; i++) {
		bonuses.push(new Portal());
		bonuses.push(new Bonus());
	}
}

// Create a bomb each 5s
var tickBomb = setInterval(function () {
	bombs.push(new Bomb());

	server.update(snakes, bonuses, bombs);
}, 5000);
