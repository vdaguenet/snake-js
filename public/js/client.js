var canvas,
	cantext,
	STAGE_WIDTH = 50,
	STAGE_HEIGTH = 50, 
	BLOCK_WIDTH = 10,
	BLOCK_HEIGTH = 10,
	server,
	snakeId;

$(function () {
	canvas = $('#stage');
	context = canvas.get(0).getContext('2d'); // get(0) return javascript native element, without jQuery
	connect();
	getKey();
});

/**
* Connection to server via socket.io & Canvas update.
*/
function connect () {
	server = io.connect('http://localhost:5000/snake');
	// Waiting for response from server with the id
	server.on('response', function (data) { 
		snakeId = data.snakeId;
	});
	// draw canvas on each update 
	server.on('update', function (snakes, bonuses, bombs) { 
		drawCanvas(snakes, bonuses, bombs);
		updateScores(snakes);
	});
}

/**
* Draw canvas with snakes and others elements
*/
function drawCanvas (snakes, bonuses, bombs) {
	// background
	context.fillStyle = '#ddd'; 

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
				context.fillStyle = "rgba(65, 105, 225," + opacity + ")";
			} else {
				context.fillStyle = "rgba(186, 85, 211, " + opacity + ")";
			}
			
			context.fillRect(snakes[i].elements[j].x*BLOCK_WIDTH, snakes[i].elements[j].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}			
	}

	// Draw bonus
	for (var k in bonuses) {
		context.fillStyle = bonuses[k].color;
		context.fillRect(bonuses[k].x*BLOCK_WIDTH, bonuses[k].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
	}

	// Draw bombs
	for (var l in bombs) {
		context.fillStyle = bombs[l].color;
		context.fillRect(bombs[l].x*BLOCK_WIDTH, bombs[l].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
	}
}

/**
* Get the key taped on keybord and emit corresponding event
*/
function getKey () {
	// Get the key taped and set the direction
	document.addEventListener('keydown', function(event) { 
		var direction = 'other';
		
		switch(event.keyCode) {
			case 37 : direction = 'left'; break;
			case 38 : direction = 'top'; break;
			case 39 : direction = 'right'; break;
			case 40 : direction = 'down'; break;
			default: return false;
		}
		// Send signal to server with the direction as parameter
	  server.emit('movement', direction); 
	}, true);
}

/**
* Change score values on user interface
*/
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
