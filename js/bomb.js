exports.Bomb = Bomb = function () {
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;

	this.init();
}

Bomb.prototype.init = function() {
	this.color = "rgba(255, 0, 0, 1)";
	this.rayon = Math.floor(Math.random() * 20);
	this.surface = [];
	this.x = Math.floor(Math.random() * this.STAGE_WIDTH);
	this.y = Math.floor(Math.random() * this.STAGE_HEIGHT);

	var begin_x = this.x - this.rayon;
	var begin_y = this.y - this.rayon;
	var end_x = this.x + this.rayon;
	var end_y = this.y + this.rayon;

	while(begin_x <= end_x) {
		while(begin_y <= end_y){
			this.surface.push({x: begin_x, y: begin_y});
			begin_y++;
		}
		begin_x++;
	}
};

Bomb.prototype.onTouch = function(snake, snakes) {
// The snake which touch die but the bomb explodes and could kill other snakes 
	
	snake.onDie();
	for (var i in snakes) {
		if (snakes[i].id != snake.id) {
			//for (var j in this.surface) {
				snakes[i].onBomb();
			//}
		}
	}

};
