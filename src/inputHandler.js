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
          car.rot = 4;
        } else {
          car.rot = -4
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
          car.rot = -4;
        } else {
          car.rot = 4;
        }
      }
    };
    right.release = function() {
      if (!left.isDown) {
        car.rot = 0;
      }
    };

    // state = play;
    gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  update();
  // renderer.render(stage);
}

function update() {
  // console.log(true);
  // world.y += speed;
  // world.x += world.xChange;
  car.rotation += car.rot;

  world.x = world.x + speed * -Math.sin(toRadians(car.rotation));
  world.y = world.y + speed * Math.cos(toRadians(car.rotation));
}

function toRadians(degree) {
    return degree * (Math.PI / 180);
};

// blackCar.x = blackCar.x + blackCar.vy * Math.cos(blackCar.rotation - toRadians(90));
// blackCar.y = blackCar.y + blackCar.vy * Math.sin(blackCar.rotation - toRadians(90));

//   blackCar.rotation += blackCar.rot;
//   // TWEEN.update();

//
// }
