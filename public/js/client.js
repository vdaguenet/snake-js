var canvas,
	cantext,
	STAGE_WIDTH = 50, // Nomber of blocks
	STAGE_HEIGTH = 50, 
	BLOCK_WIDTH = 10, // block size
	BLOCK_HEIGTH = 10,
	server,
	snakeId;

$(function () { // $(function for document.ready
	canvas = $('#stage');
	context = canvas.get(0).getContext('2d'); // get(0) return javascript native element, without jQuery
	connect();
	getKey();
	$('#kills span').html('5');
});

function connect () {
	server = io.connect('http://localhost:5000/snake'); // connect to socket

	server.on('response', function (data) { // Waiting for response from server with the id
		console.log('Snake #' + data.snakeId);
		snakeId = data.snakeId;
	});

	server.on('update', function (snakes, bonuses) { // draw canvas on each update 
		drawCanvas(snakes, bonuses);
		updateScores(snakes);
	});
}

function drawCanvas (snakes, bonus) {
	context.fillStyle = '#ddd'; // grey background

	for (var x = 0; x < STAGE_WIDTH; x++) {
		for (var y = 0; y < STAGE_HEIGTH; y++) {
			context.fillRect(x*BLOCK_WIDTH, y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}
	}

	// Draw snakes
	context.fillStyle = "rgba(75, 0, 130, 0.6)";
	for (var i in snakes) {
		for (var j = 0; j < snakes[i].currentLength; j++) {
			context.fillRect(snakes[i].elements[j].x*BLOCK_WIDTH, snakes[i].elements[j].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}			
	}

	// Draw bonus
	for (var k in bonus) {
		context.fillStyle = bonus[k].color;
		context.fillRect(bonus[k].x*BLOCK_WIDTH, bonus[k].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
	}
}

function getKey () {
	document.addEventListener('keydown', function(event) { // Get the key taped and set the direction
		var direction = 'other';
		
		switch(event.keyCode) {
			case 37 : direction = 'left'; break;
			case 38 : direction = 'top'; break;
			case 39 : direction = 'right'; break;
			case 40 : direction = 'down'; break;
			default: return false;
		}

	    server.emit('movement', direction); // Send signal to server with the direction as parameter
	}, true);
}

function updateScores (snakes) {
	for (var i in snakes) {
		if (snakes[i].id == snakeId) {
			$('#kills span').html(snakes[i].kills);
			$('#goodies span').html(snakes[i].goodies);
			$('#deaths span').html(snakes[i].deaths);
			$('#score span').html(snakes[i].score);
		}
	}

	
}