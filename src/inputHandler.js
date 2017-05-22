var world;
var speed;
var car;
var steeringAngle;

var inputHandler = module.exports = {};

inputHandler.init = function(background, auto) {
  car = auto;
  world = background;
  steeringAngle = 2;
  car.rot = 0;
  gameLoop();
}

function gameLoop() {
  if (keyDown('UP')) {
        if (car.velocity > 0) {
          car.velocity *= car.acceleration;
        } else if (car.velocity < 0) {
          car.velocity *= 1 - (car.acceleration - 1) * 5;
        } else {
          car.velocity = car.zeroVelocity;
        }
      } else if (keyDown('DOWN')) {
        if (car.velocity < 0) {
          car.velocity *= car.acceleration;
        } else if (car.velocity > 0) {
          car.velocity *= 1 - (car.acceleration - 1) * 5;
        } else {
          car.velocity = -1 * car.zeroVelocity;
        }
      } else {
        car.velocity *= 0.98;
      }

      if (Math.abs(car.velocity) < 0.5) {
        car.velocity = 0;
      }

      if (car.velocity > 0) {
        if (car.velocity > car.maxVelocity) {
          car.velocity = car.maxVelocity;
        }
      } else if (car.velocity < 0) {
        if (car.velocity < -1 / 2 * car.maxVelocity) {
          car.velocity = -1 / 2 * car.maxVelocity;
        }
      }

      if (car.velocity != 0) {
			if (keyDown('LEFT')) {
        if (keyDown('DOWN')) {
          car.rot += steeringAngle;
        } else {
          car.rot -= steeringAngle;
        }
			} else if (keyDown('RIGHT')) {
        if (keyDown('DOWN')) {
          car.rot -= steeringAngle;
        } else {
          car.rot += steeringAngle;
        }
			}
		}
      if (car.rotation > 2 * Math.PI) {
        car.rotation %= 2 * Math.PI;
      }
  requestAnimationFrame(gameLoop);
  update();
}

function keyDown(key) {
	return keys[key];
}

function keyHandler(e) {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    keys[keyCodes[e.keyCode]] = e.type === 'keydown';
    e.preventDefault();
  }
}
var keyCodes = { 37 : 'LEFT', 38 : 'UP', 39 : 'RIGHT', 40 : 'DOWN', 32 : 'SPACE' };
var keys = {
  'UP' : false,
  'DOWN' : false,
  'LEFT' : false,
  'RIGHT' : false
};

function update() {
  car.rotation = car.rot;

  world.x = Math.round(world.x + car.velocity * -Math.sin(toRadians(car.rotation)));
  world.y = Math.round(world.y + car.velocity * Math.cos(toRadians(car.rotation)));
}

function toRadians(degree) {
    return degree * (Math.PI / 180);
};

window.addEventListener(
  "keydown", keyHandler, false
);
window.addEventListener(
  "keyup", keyHandler, false
);
