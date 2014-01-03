/**
* Portal
* Teleport snake to a random position
*/
exports.Portal = Portal = function () {
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;

	this.init();
}

Portal.prototype.init = function() {
	this.color = "rgba(0, 255, 255, 1)";

	this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
	this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);
};

Portal.prototype.onTouch = function(snake) {
	snake.onPortal();
};

