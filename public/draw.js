Draw = new (function () {
	this.drawStars = function(c, viewport, stars) {
        c.beginPath();
        c.lineWidth = 1;
        c.strokeStyle = 'white';
        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            if (star.x > viewport.x && star.x < viewport.x + viewport.w && star.y > viewport.y && star.y < viewport.y + viewport.h) {
                c.moveTo(star.x - viewport.x, star.y - viewport.y);
                c.lineTo(star.x - viewport.x + 1, star.y - viewport.y + 1);
            }
        }
        c.stroke();
    };
    this.drawBullets = function(c, viewport, bullets) {
        c.beginPath();
        c.lineWidth = 2;
        c.strokeStyle = 'red';
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            var x = bullet.position.x;
            var y = bullet.position.y;
            if (x > viewport.x && x < viewport.x + viewport.w && y > viewport.y && y < viewport.y + viewport.h) {
                x -= viewport.x;
                y -= viewport.y;
                c.moveTo(x, y);
                c.lineTo(x + 1, y + 1);
            }
        }
        c.stroke();
    };
    this.drawTokens = function(c, viewport, tokens) {
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.enabled) {
                var x = token.position.x;
                var y = token.position.y;
                if (x > viewport.x && x < viewport.x + viewport.w && y > viewport.y && y < viewport.y + viewport.h) {
                    x -= viewport.x;
                    y -= viewport.y;
                    c.fillStyle = token.type === 'health' ? 'green' : 'red';
                    c.beginPath();
                    c.arc(x, y, 5, 0, Math.PI * 2);
                    c.fill();
                    c.strokeStyle = 'white';
                    c.lineWidth = 1;
                    c.beginPath();
                    c.moveTo(x - 3, y);
                    c.lineTo(x + 3, y);
                    c.moveTo(x, y - 3);
                    c.lineTo(x, y + 3);
                    c.stroke();
                }
            }
        }
    };
    this.drawShips = function(c, viewport, ships, showStatus) {
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            var x = ship.position.x;
            var y = ship.position.y;
            if (x >= viewport.x && x <= viewport.x + viewport.w && y >= viewport.y && y <= viewport.y + viewport.h) {
                x -= viewport.x;
                y -= viewport.y;
                if (ship.explosionCountdown > 0) {
                    c.fillStyle = 'red';
                    c.beginPath();
                    c.arc(x, y, Math.sin(ship.explosionCountdown / 10 * Math.PI) * 20, 0, Math.PI * 2);
                    c.fill();
                } else if (ship.health > 0) {
                    // determine ship color
                    var hitStrength = ship.shieldCountdown / 20;
                    if (ship.shieldCountdown > 0) {
                        c.strokeStyle = 'rgb(' + Math.round(hitStrength * 255) + ', ' + Math.round((1 - hitStrength) * 255) + ', ' + Math.round((1 - hitStrength) * 255) + ')';
                    } else {
                        c.strokeStyle = ship.color;
                    }
                    
                    // draw the ship
                    c.lineWidth = 1;
                    c.beginPath();
                    c.save();
                    c.translate(x, y);
                    c.save();
                    c.rotate(ship.angle);
                    c.moveTo(-8, -8);
                    c.lineTo(12, 0);
                    c.lineTo(-8, 8);
                    c.closePath();
                    c.fillStyle = c.strokeStyle;
                    c.fill();
                    
                    // draw trailing fire
                    if (ship.controls[38]) {
                        c.moveTo(-12, -4);
                        c.lineTo(-10 - (10 * (ship.counter % 2)), 0);
                        c.lineTo(-12, 4);
                    }

                    c.stroke();
                    c.restore();
                    if (ship.shieldCountdown > 0) {
                        c.beginPath();
                        c.strokeStyle = 'hsl(0,0%,' + Math.min(30, Math.round(hitStrength * 60)) + '%)';
                        c.lineWidth = 1;
                        c.arc(0, 0, 13, 0, Math.PI * 2, true);
                        c.stroke();
                    }
                    if (ship.shieldCountdown > 0 || showStatus) {
                        c.beginPath();
                        c.lineWidth = 1;
                        c.strokeStyle = 'lightgreen';
                        c.moveTo(-10, 16);
                        c.lineTo(ship.health / ship.maxHealth * 20 - 10, 16);
                        c.stroke();
                        c.beginPath();
                        c.strokeStyle = 'red';
                        c.moveTo(ship.health / ship.maxHealth * 20 - 10, 16);
                        c.lineTo(10, 16);
                        c.stroke();
                    }
                    c.restore();
                }
            }
        }
    };
})();