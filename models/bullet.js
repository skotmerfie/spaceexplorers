var vector = require('./vector');

function Bullet(owner, position, angle, velocity) {
	this.owner = owner;
	this.position = position;
	this.velocity = new vector(8, 0).rotate(angle, true).plusEq(velocity);
	this.duration = 40;

	this.update = function() {
		this.duration--;
		this.position.plusEq(this.velocity);
	};
}
module.exports = Bullet;