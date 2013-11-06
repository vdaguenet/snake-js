exports.Bomb = Bomb = function () {
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;

	this.init();
}

Bomb.prototype.init = function() {
	this.color = "rgba(255, 0, 0, 1)";

	this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
	this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);
};

Bomb.prototype.onTouch = function(snake) {
	//this.init();
	snake.onDie();
};
