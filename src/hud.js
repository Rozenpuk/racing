const resources = require('./resources');

var ui = new createjs.Container();
var textXOffset = 20;
var xscale = 1;
var xdiff = 2;

var clear = true;

var worldtest;
var cartest;
var gametest;

var hud = module.exports = {};

hud.init = function(world, car, game) {
  game.diff = (new Date()).getTime() - game.countdown;
  if (game.status != 'game') {
    ui.removeChild(ui.getChildByName('start panel'));
    ui.removeChild(ui.getChildByName('start text'));
  }
  userInterface = new Image();
	userInterface.src = resources.getResource('UI.png');
  var interfaceSheet = new createjs.SpriteSheet({
    images : [userInterface],
    frames : [
      [1184, 36, 190, 45],
      [380, 81, 49, 45],
      [1826, 224, 100, 100]
    ]
  });
  if (game.status === 'menu') {
    var cellBitmap = new createjs.Sprite(interfaceSheet);
    cellBitmap.gotoAndStop(0);
    cellBitmap.name = 'start panel';
		cellBitmap.scaleX = 1.5;
		cellBitmap.x = 400 - 190/(2/1.5);
		cellBitmap.y = 300 - 45/2;
    var startText = new createjs.Text("Пожалуйста, нажмите 'Enter'", "20px Arial", "#fafafa");
    startText.name = 'start text';
    startText.x = cellBitmap.x + 10;
    startText.y = cellBitmap.y + 30;
    startText.textBaseline = "alphabetic";

    ui.addChild(cellBitmap);
    ui.addChild(startText);
  }
  if (game.status === '321') {
    var cellBitmap = new createjs.Sprite(interfaceSheet);
    cellBitmap.gotoAndStop(1);
    cellBitmap.name = 'start panel';
    cellBitmap.y = 300 - 45/2;
    if (game.diff < 1000) {
      var startText = new createjs.Text("3", "20px Arial", "#fafafa");
		} else if (game.diff < 2000) {
			var startText = new createjs.Text("2", "20px Arial", "#fafafa");
		} else if (game.diff < 3000) {
			var startText = new createjs.Text("1", "20px Arial", "#fafafa");
		}
    if (game.diff >= 3000) {
      var startText = new createjs.Text("Старт", "20px Arial", "#fafafa");
      textXOffset = 10;
      xscale = 1.5;
      xdiff = 2/1.5;
			game.time = (new Date()).getTime();
			game.lapTime = game.time;
			game.status = 'game';
    }
    cellBitmap.scaleX = xscale;
    cellBitmap.x = 400 - 49/xdiff;
    startText.name = 'start text';
    startText.x = cellBitmap.x + textXOffset;
    startText.y = cellBitmap.y + 30;
    startText.textBaseline = "alphabetic";

    ui.addChild(cellBitmap);
    ui.addChild(startText);
  }
  if (game.status === 'game') {
    if (game.diff > 4000) {
      game.diff = null
      ui.removeChild(ui.getChildByName('start panel'));
      ui.removeChild(ui.getChildByName('start text'));
    }
    if (clear) {
      var timeBitmap = new createjs.Sprite(interfaceSheet);
      timeBitmap.gotoAndStop(0);
      timeBitmap.name = 'time panel';
  		timeBitmap.x = 20;
  		timeBitmap.y = 20;
      ui.addChild(timeBitmap);

      var speedBitmap = new createjs.Sprite(interfaceSheet);
      speedBitmap.gotoAndStop(0);
      speedBitmap.name = 'speed panel';
  		speedBitmap.x = game.width - 20 - 190;
  		speedBitmap.y = 20;
      ui.addChild(speedBitmap);

      var lapBitmap = new createjs.Sprite(interfaceSheet);
      lapBitmap.gotoAndStop(0);
      lapBitmap.name = 'lap panel';
  		lapBitmap.x = game.width/2 - 190/2;
  		lapBitmap.y = 20;
      ui.addChild(lapBitmap);

      clear = false;
    }

    ui.removeChild(ui.getChildByName('time text'));
    ui.removeChild(ui.getChildByName('speed text'));
    ui.removeChild(ui.getChildByName('lap text'));

    var timeText = new createjs.Text("Время:" + " " + (game.currentTime / 1000).toFixed(2), "20px Arial", "#fafafa");
    timeText.name = 'time text';
    timeText.x = 20 + 10;
    timeText.y = 20 + 30;
    timeText.textBaseline = "alphabetic";

    var speedText = new createjs.Text("Скорость:" + " " + (Math.abs(car.velocity) * 10).toFixed(2), "20px Arial", "#fafafa");
    speedText.name = 'speed text';
    speedText.x = game.width - 20 - 190 + 10;
    speedText.y = 20 + 30;
    speedText.textBaseline = "alphabetic";

    var lapText = new createjs.Text("Круг:" + " " + (game.lapNumber + 1) + "/" + game.numberOfLaps, "20px Arial", "#fafafa");
    lapText.name = 'lap text';
    lapText.x = game.width/2 - 190/2 + 10;
    lapText.y = 20 + 30;
    lapText.textBaseline = "alphabetic";

    ui.addChild(speedText);
    ui.addChild(timeText);
    ui.addChild(lapText);
  }
  if (game.status === 'finish') {
    ui.removeChild(ui.getChildByName('time text'));
    ui.removeChild(ui.getChildByName('speed text'));
    ui.removeChild(ui.getChildByName('lap text'));
    ui.removeChild(ui.getChildByName('speed panel'));
    ui.removeChild(ui.getChildByName('time panel'));
    ui.removeChild(ui.getChildByName('lap panel'));

    var resultBitmap = new createjs.Sprite(interfaceSheet);
    resultBitmap.gotoAndStop(2);
    resultBitmap.name = 'result panel';
    resultBitmap.scaleX = 2;
    resultBitmap.scaleY = 2;
    resultBitmap.x = 400 - 100;
    resultBitmap.y = 300 - 100;
    ui.addChild(resultBitmap);

    resultBitmap.alpha = 0;
    createjs.Tween.get(resultBitmap).to({alpha:1}, 5000)

    var resultText = new createjs.Text("Результат", "20px Arial", "#fafafa");
    resultText.name = 'result text';
    resultText.x = 400 - 50;
    resultText.y = 300 - 70;
    resultText.textBaseline = "alphabetic";

    for (var i = 0; i < game.lapTimes.length; i++) {
      var lapTimeText = new createjs.Text("Круг " + (i + 1) + ": " + (game.lapTimes[i] / 1000).toFixed(2), "20px Arial", "#fafafa");
      lapTimeText.name = 'result text';
      lapTimeText.x = 400 - 60;
      lapTimeText.y = 280 + i * 40;
      lapTimeText.textBaseline = "alphabetic";

      ui.addChild(lapTimeText);

      lapTimeText.alpha = 0;
      createjs.Tween.get(lapTimeText).to({alpha:1}, 1000)
    }
    ui.addChild(resultText);

    resultText.alpha = 0;
    createjs.Tween.get(resultText).to({alpha:1}, 1000)
  }
  world.addChild(ui);
}
