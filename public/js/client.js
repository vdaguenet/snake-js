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
});

function connect () {
	server = io.connect('http://localhost:5000/snake'); // connect to socket

	server.on('response', function (data) { // Waiting for response from server with the id
		console.log('Snake #' + data.snakeId);
		snakeId = data.snakeId;
	});

	server.on('update', function (snakes, bonuses, bombs, portals) { // draw canvas on each update 
		drawCanvas(snakes, bonuses, bombs, portals);
		updateScores(snakes);
	});
}

function drawCanvas (snakes, bonus, bombs, portals) {
	context.fillStyle = '#ddd'; // grey background

	for (var x = 0; x < STAGE_WIDTH; x++) {
		for (var y = 0; y < STAGE_HEIGTH; y++) {
			context.fillRect(x*BLOCK_WIDTH, y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}
	}

	// Draw snakes
	for (var i in snakes) {
		var opacity = 0.2;
		for (var j = 0; j < snakes[i].currentLength; j++) {
			opacity += 0.1;

			if (snakes[i].id == snakeId) {
				context.fillStyle = "rgba(50, 12, 205," + opacity + ")";
			} else {
				context.fillStyle = "rgba(75, 0, 130, " + opacity + ")";
			}
			
			context.fillRect(snakes[i].elements[j].x*BLOCK_WIDTH, snakes[i].elements[j].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}			
	}

	// Draw bonus
	for (var k in bonus) {
		context.fillStyle = bonus[k].color;
		context.fillRect(bonus[k].x*BLOCK_WIDTH, bonus[k].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
	}

	// Draw bombs
	for (var l in bombs) {
		context.fillStyle = bombs[l].color;
		context.fillRect(bombs[l].x*BLOCK_WIDTH, bombs[l].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
	}

	// Draw portal
	for ( m in portals) {
		context.fillStyle = portals[m].color;
		context.fillRect(portals[m].x*BLOCK_WIDTH, portals[m].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
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
	var div = '';
	for (var a in snakes) {
		div += '<span id="snakeId'+snakes[a].id+'">Snake #<span>'+snakes[a].id+'</span></span> - <span id="score_'+snakes[a].id+'">Score: <span>0</span></span><br />';
	}
	$('#scoreboard_others').html(div);
	for (var i in snakes) {

		if (snakes[i].id == snakeId) {
			$('#kills span').html(snakes[i].kills);
			$('#goodies span').html(snakes[i].goodies);
			$('#deaths span').html(snakes[i].deaths);
			$('#score span').html(snakes[i].score);

			$('#snakeId'+snakes[i].id).css('color', 'blue');
			$('#score_'+snakes[i].id).css('color', 'blue');
		}
		$('#snakeId'+snakes[i].id+' span').html(snakes[i].id);
		$('#score_'+snakes[i].id+' span').html(snakes[i].score);
	}
}
