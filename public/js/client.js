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
});

function connect () {
	server = io.connect('http://localhost:5000/snake'); // connect to socket

	server.on('response', function (data) { // Waiting for response from server with the id
		console.log('Snake #' + data.snakeId);
		snakeId = data.snakeId;
	});

	server.on('update', function (snakes) { // draw cnvas on each update 
		drawCanvas(snakes);
	});
}

function drawCanvas (snakes) {
	context.fillStyle = '#ddd'; // grey background

	for (var x = 0; x < STAGE_WIDTH; x++) {
		for (var y = 0; y < STAGE_HEIGTH; y++) {
			context.fillRect(x*BLOCK_WIDTH, y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}
	}

	// Draw snakes
	context.fillStyle = "rgba(255, 0, 0, 0.8)";
	for (var i in snakes) {
		for (var j = 0; j < snakes[i].currentLength; j++) {
			context.fillRect(snakes[i].elements[j].x*BLOCK_WIDTH, snakes[i].elements[j].y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}			
	}
}