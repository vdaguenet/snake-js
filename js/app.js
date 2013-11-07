var Server = require('./server.js').Server,
	Snake = require('./snake.js').Snake,
	Bomb = require('./bomb.js').Bomb,
	Wall = require('./wall.js').Wall,
	Portal = require('./portal.js').Portal,
	Bonus = require('./bonus.js').Bonus;

var server = new Server();
server.init(5000);

var snakes = {}, // snakes array
 	bonuses = [],
 	portals = [],
 	walls = [],
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
				bombs[k].onTouch(snakes[s1], snakes);
				bombs.splice(k, 1);
				break;
			}	
		}

		for ( var l in portals) {
			if (snakes[s1].hasColision(portals[l])) { // s1 touch a portal
				portals[l].onTouch(snakes[s1]);
			}
		}

		for ( var m in walls) {
			if (snakes[s1].hasColision(walls[m])) { // s1 touch a wall
				walls[m].onTouch(snakes[s1]);
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
	server.update(snakes, bonuses, bombs, portals, walls);
}, 100); // function executed every 100 ms

function createBonuses() { // Init bonuses and portals
	for (var i = 0; i < 2; i++) {
		portals.push(new Portal());
		bonuses.push(new Bonus());
	}
}

// Create or change position of a bomb each 5s
var tickBomb = setInterval(function () {
	if (bombs.length >= 3) {
		var cpt = Math.floor(Math.random() * 3);
		bombs[cpt].init();
	} else {
		bombs.push(new Bomb());
	}

	server.update(snakes, bonuses, bombs, portals, walls);
}, 5000);

// Create walls each 5s
var tickWall = setInterval(function () {

	walls.push(new Wall());
	server.update(snakes, bonuses, bombs, portals, walls);

}, 3000);
