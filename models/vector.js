function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}
Vector.prototype.reset = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
};
Vector.prototype.toString = function(decPlaces) {
	decPlaces = decPlaces || 3;
	var scalar = Math.pow(10, decPlaces);
	return "[" + Math.round(this.x * scalar) / scalar + ", " + Math.round(this.y * scalar) / scalar + "]";
};
Vector.prototype.clone = function() {
	return new Vector(this.x, this.y);
};
Vector.prototype.copyTo = function (v) {
	v.x = this.x;
	v.y = this.y;
};
Vector.prototype.copyFrom = function (v) {
	this.x = v.x;
	this.y = v.y;
};
Vector.prototype.magnitude = function () {
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
};
Vector.prototype.magnitudeSquared = function () {
	return (this.x * this.x) + (this.y * this.y);
}
Vector.prototype.normalise = function () {
	var m = this.magnitude();
	this.x = this.x / m;
	this.y = this.y / m;
	return this;
};
Vector.prototype.reverse = function () {
	this.x = -this.x;
	this.y = -this.y;
	return this;
};
Vector.prototype.plusEq = function (v) {
	this.x += v.x;
	this.y += v.y;
	return this;
};
Vector.prototype.plusNew = function (v) {
	return new Vector(this.x + v.x, this.y + v.y);
};
Vector.prototype.minusEq = function (v) {
	this.x -= v.x;
	this.y -= v.y;
	return this;
};
Vector.prototype.minusNew = function (v) {
	return new Vector(this.x - v.x, this.y - v.y);
};
Vector.prototype.multiplyEq = function (scalar) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
};
Vector.prototype.multiplyNew = function (scalar) {
	var returnvec = this.clone();
	return returnvec.multiplyEq(scalar);
};
Vector.prototype.divideEq = function (scalar) {
	this.x /= scalar;
	this.y /= scalar;
	return this;
};
Vector.prototype.divideNew = function (scalar) {
	var returnvec = this.clone();
	return returnvec.divideEq(scalar);
};
Vector.prototype.dot = function (v) {
	return (this.x * v.x) + (this.y * v.y);
};
Vector.prototype.angle = function (useRadians) {
	return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
};
Vector.prototype.rotate = function (angle, useRadians) {
	var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
	var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
	var temp = new Vector();
	temp.copyFrom(this);
	this.x = (temp.x * cosRY) - (temp.y * sinRY);
	this.y = (temp.x * sinRY) + (temp.y * cosRY);
	return this;
};
Vector.prototype.equals = function (v) {
	return ((this.x == v.x) && (this.y == v.x));
};
Vector.prototype.isCloseTo = function (v, tolerance) {
	if (this.equals(v))
		return true;
	var temp = new Vector();
	temp.copyFrom(this);
	temp.minusEq(v);
	return (temp.magnitudeSquared() < tolerance * tolerance);
};
Vector.prototype.rotateAroundPoint = function (point, angle, useRadians) {
	var temp = new Vector();
	temp.copyFrom(this);
	temp.minusEq(point);
	temp.rotate(angle, useRadians);
	temp.plusEq(point);
	this.copyFrom(temp);
};
Vector.prototype.isMagLessThan = function (distance) {
	return (this.magnitudeSquared() < distance * distance);
};
Vector.prototype.isMagGreaterThan = function (distance) {
	return (this.magnitudeSquared() > distance * distance);
};

module.exports = Vector;


/*
	exports.Vector2Const = {
		TO_DEGREES: 180 / Math.PI,
		TO_RADIANS: Math.PI / 180
	}
*/