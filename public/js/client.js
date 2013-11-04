var canvas,
	cantext,
	STAGE_WIDTH = 50, // Nombre de block par ligne
	STAGE_HEIGTH = 50, // Nombre de block par colone
	BLOCK_WIDTH = 10, // largeur d'un block
	BLOCK_HEIGTH = 10, // hauteur d'un block
	server,
	snakeId;

$(function () { // $(function pour document.ready
	canvas = $('#stage');
	context = canvas.get(0).getContext('2d'); // get(0) retourne l'élément natif de javascript, sans jQuery

	connect();
});

function connect () {
	server = io.connect('http://localhost:5000/snake');

	server.on('response', function (data) {
		console.log('Snake #' + data.snakeId);
		snakeId = data.snakeId;
	});

	server.on('update', function (snakes) {
		drawCanvas(snakes);		
	});
}

function drawCanvas (snakes) {
	context.fillStyle = '#ddd';
	var color = 0;
	for (var x = 0; x < STAGE_WIDTH; x++) {
		for (var y = 0; y < STAGE_HEIGTH; y++) {
			color++
			context.fillRect(x*BLOCK_WIDTH, y*BLOCK_HEIGTH, BLOCK_WIDTH-1, BLOCK_HEIGTH-1);
		}
	}

	for (var i = 0; i < snakes.length; i++) {
			
	}
}