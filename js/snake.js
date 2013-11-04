// Constructor
exports.Snake = Snake = function() {
	this.SNAKE_LENGTH = 8;
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;
};

Snake.prototype.init = function(snakeId) {
	this.id = snakeId;
	this.kills = 0;
	this.deaths = 0;
	this.currentLength = this.SNAKE_LENGTH;
	this.elements = [];

	var rand = Math.floor(Math.random() * this.STAGE_HEIGHT);

	for (var i = 0; i < this.SNAKE_LENGTH; i++) {
		this.elements.push({x: -i, y: rand});
	};
};