var vector = require('./vector');
var common = require('./common');
var bullet = require('./bullet');

function Enemy(type, initialPosition, respawnRate) {
	//ship identification variables
	this.type = type;

	//movement variables
	this.initialPosition = initialPosition.clone();
	this.position = initialPosition.clone();
	this.velocity = new vector(0, 0);
	this.angle = common.random(360) * Math.PI / 180;
	this.targetAngle = this.angle;
	this.targetPosition = initialPosition.clone();

	//ship state variables
	this.maxHealth = 100;
	this.health = 100;
	this.shieldCountdown = 0;
	this.explosionCountdown = 0;
	this.counter = 0;
	this.enabled = true;
	this.respawnRate = respawnRate;
	this.respawnCountdown = 0;
	this.target = null;

	//ship state functions
	this.isAlive = function() { return this.enabled && this.health > 0 };
	this.isShieldUp = function() { return this.shieldCountdown > 0 };
	this.isExploding = function() { return this.explosionCountdown > 0 };

	this.update = function(playerShips) {
		if (!this.enabled) {
			if (this.respawnCountdown > 0) {
				this.respawnCountdown--;
			} else {
				this.enabled = true;
			}
		} else {
			//adjust velocity and angle based on controls
			this.velocity.multiplyEq(0.96);
			var speed = 0.5;

			//TODO: AI to move enemy

			//if no target, find one
			if (this.target === null) {
				for (var i = 0; i < playerShips.length; i++) {
					if (this.position.minusNew(playerShips[i].position).isMagLessThan(100)) {
						this.target = playerShips[i].id;
						console.log("found target: " + this.target);
						break;
					}
				}
			}
			
			//if target, move towards it
			if (this.target !== null) {
				var targetShip = null;

				//find targetShip
				for (var i = 0; i < playerShips.length; i++) {
					if (playerShips[i].id === this.target) {
						targetShip = playerShips[i];
						break;
					}
				}
				if (targetShip !== null) {
					this.targetAngle = common.angleTo(this.position, targetShip.position);
					var angleDiff = Math.abs(this.angle - this.targetAngle);
					console.log("AngleDiff: " + angleDiff);
					var angleThreshold = 10 * Math.PI / 180;
					console.log("Threshold: " + angleThreshold);
					if (angleDiff < angleThreshold) {
						this.fire();
					}
				} else {
					console.log("Lost Target: " + this.target);
					//can't find target, must have died, clear target to find another
					this.target = null;
				}
			}			
			
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
		}
		this.counter++;
	};

	this.hit = function() {
		if (this.isShieldUp() || !this.isAlive())
			return;

		this.health -= 5;
		if (this.health <= 0) {
			this.explosionCountdown = 10;
			this.respawnCountdown = respawnRate;
			this.enabled = false;
		} else {
			this.shieldCountdown = 20;
		}
	}

	this.fire = function() {
		console.log("fire");
		return new bullet(this.id, this.position.clone(), this.angle, this.velocity.clone());
	};

	this.setControls = function(controls) {
		this.controls = controls;
	};
}

module.exports = Enemy;