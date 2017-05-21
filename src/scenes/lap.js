const resources = require('../resources');
const car = require('../car');
const inputHandler = require('../inputHandler');

var mapData = resources.getResource('lap.json');
var roadTiles = resources.getResource('road.json');
// var carsData = resources.getResource('cars.json');
// var carsImage = resources.getResource('cars.png');

var tileset;
var stage;
var world;

var lap = module.exports = {};

lap.init = function(gameStage) {
	stage = gameStage;
	tileset = new Image();
	tileset.src = resources.getResource('tiles.png');
	tileset.onLoad = initLayers();
	car.init(stage);
	inputHandler.init(world, car)
}

function initLayers() {
	var w = roadTiles.tilewidth;
	var h = roadTiles.tileheight;
	var imageData = {
		images : [ tileset ],
		frames : {
			width : w,
			height : h
		}
	};
	var tilesetSheet = new createjs.SpriteSheet(imageData);

	world = new createjs.Container();
	world.x = 0;
	world.y = 0;

	for (var idx = 0; idx < mapData.layers.length; idx++) {
		var layerData = mapData.layers[idx];
		// if (layerData.type == 'tilelayer')
			initLayer(layerData, tilesetSheet, roadTiles.tilewidth, roadTiles.tileheight);
	}
	console.log(mapData);
	stage.addChild(world);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', stage);
}

function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {
	for ( var y = 0; y < layerData.height; y++) {
		for ( var x = 0; x < layerData.width; x++) {
			var cellBitmap = new createjs.Sprite(tilesetSheet);
			var idx = x + y * layerData.width;
			cellBitmap.gotoAndStop(layerData.data[idx] - 1);
      cellBitmap.x = (x - 17) * tilewidth;
      cellBitmap.y = (y - 12) * tileheight;

			// stage.addChild(cellBitmap);
			world.addChild(cellBitmap);
		}
	}
}



// function httpGet(theUrl) {
// 	var xmlHttp = null;
// 	xmlHttp = new XMLHttpRequest();
// 	xmlHttp.open("GET", theUrl, false);
// 	xmlHttp.send(null);
// 	return xmlHttp.responseText;
// }
//
// function httpGetData(theUrl) {
// 	var responseText = httpGet(theUrl);
// 	return JSON.parse(responseText);
// }
