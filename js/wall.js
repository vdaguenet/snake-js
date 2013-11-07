exports.Wall = Wall = function () {
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;

	this.init();
}

Wall.prototype.init = function() {
	this.color = "#333";

	this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
	this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);
};

Wall.prototype.onTouch = function(snake) {
	snake.onDie();
};

