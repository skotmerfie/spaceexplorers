var vector = require('./vector');
var common = require('./common');
var ship = require('./ship');
var token = require('./token');

function Space() {
	this.maxWidth = common.SPACE_WIDTH;
	this.maxHeight = common.SPACE_HEIGHT;
	this.shipMaxSpeed = 10;
	this.shipSize = 26;
	this.stars = [];
	this.ships = [];
	this.bullets = [];
	this.tokens = [];

	var numberOfStars = common.SPACE_WIDTH / 10;
	for (var i = 0; i < numberOfStars; i++) {
		this.stars.push({
			x: common.random(this.maxWidth),
			y: common.random(this.maxHeight)
		});
	}
	this.tokens.push(new token(new vector(common.SPACE_WIDTH / 2, 200), 'health', 25, 200));
}

Space.prototype.tick = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		var bullet = this.bullets[i];
		bullet.update();
		if (bullet.duration === 0) {
			this.bullets.splice(i--, 1);
		} else {
			for (var j = 0; j < this.ships.length; j++) {
				var ship = this.ships[j];
				if (ship.id !== bullet.owner && ship.isAlive()) {
					if (ship.position.isCloseTo(bullet.position, 10)) {
						this.bullets.splice(i--, 1);
						ship.hit();
						break;
					}
				}
			}
		}
	}
	for (var i = 0; i < this.ships.length; i++) {
		var ship = this.ships[i];
		var origPosition = ship.position.clone();
		ship.update();
		if (ship.isAlive()) {
			for (var j = 0; j < this.ships.length; j++) {
				var ship2 = this.ships[j];
				if (ship.id !== ship2.id && ship2.isAlive()) {
					var diff = ship2.position.clone();
					diff.minusEq(ship.position);
					if (diff.isMagLessThan(this.shipSize)) {
						var distance = diff.magnitude();
						var force = 1 - (distance / this.shipSize);
						diff.normalise();
						diff.multiplyEq(force * -this.shipMaxSpeed);

						ship2.velocity.minusEq(diff);
						if (ship2.velocity.isMagGreaterThan(this.shipMaxSpeed))
							ship2.velocity.multiplyEq(this.shipMaxSpeed / ship2.velocity.magnitude());
						ship2.hit();
						
						ship.velocity.plusEq(diff);
						if (ship.velocity.isMagGreaterThan(this.shipMaxSpeed))
							ship.velocity.multiplyEq(this.shipMaxSpeed / ship.velocity.magnitude());
						
						ship.position = origPosition;
						ship.position.plusEq(ship.velocity);
						ship.hit();
					}
				}
			}
			for (var j = 0; j < this.tokens.length; j++) {
				var token = this.tokens[j];
				if (token.enabled) {
					if (token.position.isCloseTo(ship.position, 15)) {
						token.eaten();
						if (token.type === 'health') {
							ship.health += token.value;
							if (ship.health > ship.maxHealth)
								ship.health = ship.maxHealth;
						}
					}
				}
			}
		} else if (!ship.isExploding()) {
			this.ships.splice(i--, 1);
		}
	}
	for (var i = 0; i < this.tokens.length; i++) {
		this.tokens[i].update();
	}
};

Space.prototype.addShip = function(id) {
	this.ships.push(new ship(id, 'white'));
};

Space.prototype.setShipControls = function(id, controls) {
	var ship = this.findShip(id);
	if (ship) ship.setControls(controls);
};

Space.prototype.shipFiredBullet = function(id) {
	var ship = this.findShip(id);
	if (ship) {
		var bullet = ship.fire();
		this.bullets.push(bullet);
	}
};

Space.prototype.findShip = function(id) {
	for (var i = 0; i < this.ships.length; i++) {
		if (this.ships[i].id === id) {
			return this.ships[i];
		}
	}
};

module.exports = Space;