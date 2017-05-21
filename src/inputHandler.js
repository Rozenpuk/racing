const input = require('./inputs');

var world;
var speed;
var car;

var inputHandler = module.exports = {};

inputHandler.init = function(background, auto) {
car = auto;
world = background;
speed = 0;
car.rotation = 0;
car.rot = 0;

// function move(x, y) {
//   createjs.Tween.get(world)
//   .to({x: world.regX, y: world.regY}, 1000)
// }
// car.rotation = 10;

var left = input.keyboard(37),
    up = input.keyboard(38),
    right = input.keyboard(39),
    down = input.keyboard(40);

    up.press = function() {
      speed = 10;
      // world.xChange = -10;
    };
    up.release = function() {
      if (!down.isDown) {
        speed = 0;
      }
    };

    down.press = function() {
      speed = -5;
    };
    down.release = function() {
      if (!up.isDown) {
        speed = 0;
      }
    };

    left.press = function() {
      if(speed !== 0) {
        if(down.isDown) {
          car.rot = 3;
        } else {
          car.rot = -3
        }
      }
    };
    left.release = function() {
      if (!right.isDown) {
        car.rot = 0;
      }
    };

    right.press = function() {
      if(speed !== 0) {
        if(down.isDown) {
          car.rot = -3;
        } else {
          car.rot = 3;
        }
      }
    };
    right.release = function() {
      if (!left.isDown) {
        car.rot = 0;
      }
    };
    gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  update();
}

function update() {
  car.rotation += car.rot;

  world.x = Math.round(world.x + speed * -Math.sin(toRadians(car.rotation)));
  world.y = Math.round(world.y + speed * Math.cos(toRadians(car.rotation)));
}

function toRadians(degree) {
    return degree * (Math.PI / 180);
};
