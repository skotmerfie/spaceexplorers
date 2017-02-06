$(document).ready(function () {
	var socket = io.connect();
	var canvas = document.getElementById('canvas');
	var c = canvas.getContext('2d');

	var space = {};
	var keysPressed = {};
	var viewport;
	var showStatus = false;

	socket.on('tick', function (data) {
		space = data;
		draw();
	});

	function draw() {
		c.clearRect(0, 0, canvas.width, canvas.height);
		updateViewport();
		c.save();
		c.scale(canvas.width / viewport.w, canvas.width / viewport.w);
		Draw.drawStars(c, viewport, space.stars);
		Draw.drawBullets(c, viewport, space.bullets);
		Draw.drawTokens(c, viewport, space.tokens);
		Draw.drawShips(c, viewport, space.ships, showStatus);
		c.restore();
	}

	function updateViewport() {
		var me = findMyShip();
		if (me) {
			var aspect = canvas.height / canvas.width;
			var zoom = 600 + Math.sqrt((me.velocity.x * me.velocity.x) + (me.velocity.y * me.velocity.y)) * 50;

			var targetViewport = {
				x: me.position.x - zoom / 2,
				y: me.position.y - zoom * aspect / 2,
				w: zoom,
				h: zoom * aspect
			};

			/*
			if (targetViewport.x < 0)
				targetViewport.x = 0;
			if (targetViewport.x + targetViewport.w > space.maxWidth)
				targetViewport.x = space.maxWidth - targetViewport.w;
			if (targetViewport.y < 0)
				targetViewport.y = 0;
			if (targetViewport.y + targetViewport.h > space.maxHeight)
				targetViewport.y = space.maxHeight - targetViewport.h;
			*/
			if (viewport === undefined) {
				viewport = {
					x: targetViewport.x,
					y: targetViewport.y,
					w: targetViewport.w,
					h: targetViewport.h
				};
			} else {
				var movespeed = 0.05;
				var zoomspeed = 0.05;
				viewport.x += (targetViewport.x - viewport.x) * movespeed;
				viewport.y += (targetViewport.y - viewport.y) * movespeed;
				viewport.w += (targetViewport.w - viewport.w) * zoomspeed;
				viewport.h += (targetViewport.h - viewport.h) * zoomspeed;
			}
		}
	}

	function findMyShip() {
		for (var i = 0; i < space.ships.length; i++) {
			if (space.ships[i].id === socket.id) {
				return space.ships[i];
			}
		}
	}

	var movementKeys = [37, 38, 39, 40];
	var actionKeys = [17, 32];
	var statusKeys = [9];
	$(document).keydown(function (e) {
		if (movementKeys.indexOf(e.keyCode) > -1) {
			keysPressed[e.keyCode] = true;
			socket.emit("steer", keysPressed);
			e.preventDefault();
		} else if (actionKeys.indexOf(e.keyCode) > -1) {
			socket.emit("fire");
			e.preventDefault();
		} else if (statusKeys.indexOf(e.keyCode) > -1) {
			showStatus = true;
			e.preventDefault();
		}
	});
	$(document).keyup(function (e) {
		if (movementKeys.indexOf(e.keyCode) > -1) {
			keysPressed[e.keyCode] = false;
			socket.emit("steer", keysPressed);
			e.preventDefault();
		} else if (statusKeys.indexOf(e.keyCode) > -1) {
			showStatus = false;
			e.preventDefault();
		}
	});
});