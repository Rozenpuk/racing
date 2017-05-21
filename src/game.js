const lap = require('./scenes/lap');
const resources = require('./resources');
const drawCar = require('./car');
const test = require('./scenes/test')

var game = module.exports = {};

var stage = new createjs.Stage("canvas");

game.init = function() {
  lap.init(stage);
  // test.init(stage);
  // resize();
}

function resize() {
	stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;
}

// var mapData = resources.getResource('lap.json');
// console.log(mapData.layers[2].objects[0]);
// console.log(draw.init);
