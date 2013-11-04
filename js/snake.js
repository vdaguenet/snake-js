// Constructor
exports.Snake = Snake = function() {
	this.SNAKE_LENGTH = 8;
};

Snake.prototype.init = function() {
	this.kills = 0;
	this.deaths = 0;
	this.currentLength = this.SNAKE_LENGTH;
	this.elements = [];
};