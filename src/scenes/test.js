const resources = require('../resources');
const car = require('../car');

var test = module.exports = {};

test.init = function(gameStage) {
	stage = gameStage;
	tileset = new Image();
	car.init(stage);

	createjs.Ticker.addEventListener('tick', stage);
  createjs.Ticker.setFPS(20);
  console.log(true);
}
