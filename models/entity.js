function Entity(position, velocity, angle, targetAngle) {
    this.position = position;
    this.velocity = velocity;
    this.angle = angle;
    this.targetAngle = targetAngle;
}

Entity.prototype.updatePosition = function() {
    this.position.plusEq(this.velocity);
    common.ensurePositionInSpace(this.position);
}