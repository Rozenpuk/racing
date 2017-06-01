var SAT = require('sat');
var hud = require('./hud');

var world;
var game;
var car;
var steeringAngle;

var inputHandler = module.exports = {};

inputHandler.init = function(background, auto, gameState) {
  car = auto;
  world = background;
  game = gameState;
  steeringAngle = 2;
  timer = 0;

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

    if (Math.abs(car.velocity) > 0.5) {
		if (keyDown('LEFT') && !game.lock) {
      if (keyDown('DOWN')) {
        car.rot += steeringAngle;
      } else {
        car.rot -= steeringAngle;
      }
		} else if (keyDown('RIGHT') && !game.lock) {
      if (keyDown('DOWN')) {
        car.rot -= steeringAngle;
      } else {
        car.rot += steeringAngle;
      }
		}
	}
  if (car.rotation > 2 * Math.PI) {
    car.rotation /= 2 * Math.PI;
  }
  if (game.status != 'finish') {
    requestAnimationFrame(gameLoop);
    game.update(car, world);
  }
}



function keyDown(key) {
	return keys[key];
}

function keyHandler(e) {
  if (game.status === 'menu') {
		if (e.keyCode === 13) {
			game.status = '321';
      game.countdown = (new Date()).getTime();
      hud.init(world, car, game)
		}
	}
  if (e.keyCode >= 37 && e.keyCode <= 40 && game.status === 'game') {
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

function toRadians(degree) {
    return degree * (Math.PI / 180);
};

window.addEventListener(
  "keydown", keyHandler, false
);
window.addEventListener(
  "keyup", keyHandler, false
);
