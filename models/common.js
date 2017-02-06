(function (exports) {
	exports.SPACE_WIDTH = 2000;
	exports.SPACE_HEIGHT = 2000;
	exports.SHIP_SIZE = 13;
	exports.radians = function (deg) {
		return deg * Math.PI / 180;
	};
	exports.degrees = function (rad) {
		return rad * 180 / Math.PI;
	};
	exports.randomInteger = function (min, max) {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	}
	exports.random = function (min, max) {
		if (min === undefined) {
			min = 0;
			max = 1;
		} else if (max === undefined) {
			max = min;
			min = 0;
		}
		return (Math.random() * (max - min)) + min;
	};
	exports.map = function (value, min1, max1, min2, max2, clampResult) {
		var returnvalue = ((value - min1) / (max1 - min1) * (max2 - min2)) + min2;
		if (clampResult) return clamp(returnvalue, min2, max2);
		else return returnvalue;
	};
	exports.clamp = function (value, min, max) {
		if (max < min) {
			var temp = min; min = max; max = temp;
		}
		return Math.max(min, Math.min(value, max));
	};
	exports.dist = function (x1, y1, x2, y2) {
		x2 -= x1; y2 -= y1;
		return Math.sqrt((x2 * x2) + (y2 * y2));
	}
})(typeof exports === 'undefined' ? this['common'] = {} : exports);