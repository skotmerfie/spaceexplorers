function Token(position, type, value, respawnRate) {
	this.position = position;
	this.type = type;
	this.value = value;
	this.enabled = true;
	this.respawnRate = respawnRate;
	this.respawnCountdown = 0;

	this.update = function() {
		if (!this.enabled) {
			if (this.respawnCountdown > 0) {
				this.respawnCountdown--;
			} else {
				this.enabled = true;
			}
		}
	};

	this.eaten = function() {
		this.enabled = false;
		this.respawnCountdown = respawnRate;
	}
}
module.exports = Token;