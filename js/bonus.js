exports.Bonus = Bonus = function () {
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;

	this.init();
}

Bonus.prototype.init = function() {
	this.color = "rgba(46, 222, 87, 1)";

	this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
	this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);
};

Bonus.prototype.onTouch = function(snake) {
	snake.goodies++;
	snake.grow();
};

