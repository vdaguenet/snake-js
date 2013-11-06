// Constructor. Init constant values
exports.Snake = Snake = function() {
	this.SNAKE_LENGTH = 8;
	this.STAGE_HEIGHT = 50 - 1;
	this.STAGE_WIDTH = 50 - 1;
};

// Init the snake
Snake.prototype.init = function(snakeId) {
	this.id = snakeId;
	this.goodies = 0;
	this.kills = 0;
	this.deaths = 0;
	this.currentLength = this.SNAKE_LENGTH;
	this.elements = [];
	this.direction = 'right';

	this.initElements();
};

Snake.prototype.initElements = function() {
	var rand = Math.floor(Math.random() * this.STAGE_HEIGHT);
	for (var i = this.currentLength; i > 0; i--) {
		this.elements.push({x: -i, y: rand});
	}
};

// Function for snake movement
Snake.prototype.doStep = function() {
	for (var i = 0; i < this.currentLength-1; i++) {
		this.moveBlock(i);
	}
	this.moveHead();
};

// Current block takes next block coordonates
Snake.prototype.moveBlock = function(i) {
	this.elements[i].x = this.elements[i+1].x;
	this.elements[i].y = this.elements[i+1].y;
};

// Movement of the head of the snake in function of direction. Go back to the bigining if the snake reach the end of canvas
Snake.prototype.moveHead = function() {
	var head = this.elements[this.currentLength-1];

	switch(this.direction) {
		case 'right' :
			head.x++;

			if (head.x > this.STAGE_WIDTH) {
				head.x = 0;
			}
		break;
		case 'left' : 
			head.x--;
			if (head.x < 0) {
				head.x = this.STAGE_WIDTH;
			}
		break;
		case 'top' : 
			head.y--;

			if (head.y < 0) {
				head.y = this.STAGE_HEIGHT;
			}
		break;
		case 'down' : 
			head.y++;

			if (head.y > this.STAGE_HEIGHT) {
				head.y = 0;
			}
		break;
	}
};

Snake.prototype.setDirection = function(direction) {
	if (direction != this.direction && !(this.direction == 'right' && direction == 'left') && !(this.direction == 'left' && direction == 'right') && !(this.direction == 'top' && direction == 'down') && !(this.direction == 'down' && direction == 'top')) {
		this.direction = direction;
	}
};

Snake.prototype.reset = function() {
	this.goodies = 0;
	this.currentLength = this.SNAKE_LENGTH;
	this.elements = [];
	this.initElements();
	this.direction = 'right';
};

Snake.prototype.onDie = function() {
	this.reset();
	this.deaths++;
};

Snake.prototype.hasColision = function(element) {
	var head = this.elements[this.currentLength-1];

	if(element.x == head.x && element.y == head.y) {
		return true;
	}

	return false;
};


// Add a new element on the snake
Snake.prototype.grow = function() {
	var old_pos = this.elements[0];

	this.elements.unshift({x: old_pos.x, y: old_pos.y});
	this.currentLength++;
};