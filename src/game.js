const lap = require('./scenes/lap');
const resources = require('./resources');
const drawCar = require('./car');
const SAT = require('sat');
const hud = require('./hud');

var timer;
var worldX = 0;
var worldY = 0;
var checkpoint = 0;
var t;

var game = module.exports = {};

var stage = new createjs.Stage("canvas");

game.width = stage.canvas.width;
game.height = stage.canvas.height;

game.status = 'menu';
game.countdown = null;
game.diff = 0;
game.currentTime = 0;
game.time = 0;
game.lapTime = 0;
game.lapNumber = 0;
game.numberOfLaps = 3;
game.lapTimes = [];
game.lock = false;

game.init = function() {
  lap.init(stage, game);
  timer = 0;
}

function resize() {
	stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;
}

game.update = function(car, stage) {
  if (lap.checkpoints[checkpoint].x <= car.box.pos.x &&
    car.box.pos.x <= lap.checkpoints[checkpoint].x + lap.checkpoints[checkpoint].w &&
    lap.checkpoints[checkpoint].y <= car.box.pos.y &&
    car.box.pos.y <= lap.checkpoints[checkpoint].y + lap.checkpoints[checkpoint].h) {
      if (checkpoint < lap.checkpoints.length - 1) {
        checkpoint++;
      } else {
        game.lapTimes.push(game.currentTime);
        game.time = t;
        checkpoint = 0;
        game.lapNumber++;
      }
    }

  var world = stage.children[0]
  car.rotation = car.rot;

  world.x = Math.round(world.x + car.velocity * -Math.sin(toRadians(car.rotation)));
  world.y = Math.round(world.y + car.velocity * Math.cos(toRadians(car.rotation)));
  if (world.x != worldX || world.y != worldY) {
    for (var j = 0; j < world.children[1800].children.length; j++) {
      world.children[1800].children[j].box.pos.x += world.x - worldX;
      world.children[1800].children[j].box.pos.y += world.y - worldY;
    }
    for (var k = 0; k < lap.checkpoints.length; k++) {
      lap.checkpoints[k].x += world.x - worldX;
      lap.checkpoints[k].y += world.y - worldY;
    }
    car.box.setAngle(toRadians(car.rotation));
  }

  var response = new SAT.Response();

  for (var k = 0; k < world.children[1800].children.length; k++) {
    var collided = SAT.testPolygonPolygon(world.children[1800].children[k].box, car.box, response);
  }

  worldX = world.x;
  worldY = world.y;

  if (response.a != null && response.b != null && response.overlap > 1 && timer < 1) {
    car.velocity = -2.5 * car.velocity / 1.5;
    game.lock = true;
  }

  if(game.lock && timer < 15) {
    timer ++
  } else {
    game.lock = false;
    timer = 0;
  }

  t = (new Date()).getTime();
  game.currentTime = t - game.time;
  if (game.lapNumber == game.numberOfLaps) {
    game.status = 'finish';
    car.velocity = 0;
    world.x = worldX;
    world.y = worldY;
  }

  hud.init(stage, car, game);
}

function toRadians(degree) {
    return degree * (Math.PI / 180);
};
