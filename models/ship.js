var vector = require('./vector');
var common = require('./common');
var bullet = require('./bullet');

function Ship(id, color) {
	//ship identification variables
	this.id = id;
	this.color = color;

	//movement variables
	this.position = new vector(common.random(common.SPACE_WIDTH), common.random(common.SPACE_HEIGHT));
	this.velocity = new vector(0, 0);
	this.angle = common.random(360);
	this.targetAngle = this.angle;
	this.controls = {};

	//ship state variables
	this.maxHealth = 100;
	this.health = 100;
	this.shieldCountdown = 20;
	this.explosionCountdown = 0;
	this.counter = 0;

	//ship state functions
	this.isAlive = function() { return this.health > 0 };
	this.isShieldUp = function() { return this.shieldCountdown > 0 };
	this.isExploding = function() { return this.explosionCountdown > 0 };

	this.update = function() {
		//adjust velocity and angle based on controls
		this.velocity.multiplyEq(0.96);
		var speed = 0.5;
		if (this.controls[39]) { this.targetAngle += (10 * Math.PI / 180); }
		if (this.controls[37]) { this.targetAngle -= (10 * Math.PI / 180); }
		if (this.controls[38]) {
			this.velocity.x += Math.cos(this.angle) * speed;
			this.velocity.y += Math.sin(this.angle) * speed;
		}
		if (this.controls[40]) { this.velocity.multiplyEq(0.9); }

		//move the ship
		this.position.plusEq(this.velocity);

		//ensure ship stays in space boundaries
		if (this.position.x < common.SHIP_SIZE) this.position.x = common.SHIP_SIZE;
		if (this.position.x > common.SPACE_WIDTH - common.SHIP_SIZE) this.position.x = common.SPACE_WIDTH - common.SHIP_SIZE;
		if (this.position.y < common.SHIP_SIZE) this.position.y = common.SHIP_SIZE;
		if (this.position.y > common.SPACE_HEIGHT - common.SHIP_SIZE) this.position.y = common.SPACE_HEIGHT - common.SHIP_SIZE;

		if (this.isExploding()) {
			this.explosionCountdown--;
		} else {
			this.shieldCountdown--;

			if (this.targetAngle > this.angle + Math.PI) {
				this.targetAngle -= Math.PI * 2;
			}
			if (this.targetAngle < this.angle - Math.PI) {
				this.targetAngle += Math.PI * 2;
			}
			this.angle += (this.targetAngle - this.angle) * 0.4;
		}
		this.counter++;
	};

	this.hit = function() {
		if (this.isShieldUp() || !this.isAlive())
			return;

		this.health -= 5;
		if (this.health <= 0)
			this.explosionCountdown = 10;
		else 
			this.shieldCountdown = 20;
	}

	this.fire = function() {
		return new bullet(this.id, this.position.clone(), this.angle, this.velocity.clone());
	};

	this.setControls = function(controls) {
		this.controls = controls;
	};
}

module.exports = Ship;