const resources = require('../resources');
const car = require('../car');
const inputHandler = require('../inputHandler');
const objectsData = require('../assets/objects');
var SAT = require('sat');

var mapData = resources.getResource('lap.json');
var roadTiles = resources.getResource('road.json');

var tileset;
var stage;
var world;
var objectTiles;
var obstacles;

var lap = module.exports = {};

lap.init = function(gameStage, game) {
	stage = gameStage;
	tileset = new Image();
	objectTiles = new Image();
	tileset.src = resources.getResource('tiles.png');
	objectTiles.src = resources.getResource('objects.png');
	tileset.onLoad = initLayers();
	car.init(stage, game);
	inputHandler.init(stage, car, game);
}

lap.checkpoints = [
	{x:2045 - 2176, y:300 - 1536, h: 350, w: 10},
	{x:1150 - 2176, y:2170 - 1536, h: 10, w: 350},
	{x:2400 - 2176, y:1700 - 1536, h: 10, w: 350}
]

function initLayers() {
	var w = roadTiles.tilewidth;
	var h = roadTiles.tileheight;
	var imageData = {
		images: [tileset],
		frames: {
			width: w,
			height: h
		}
	};
	var tilesetSheet = new createjs.SpriteSheet(imageData);

	var objectsSprites = new createjs.SpriteSheet({
		images: [objectTiles],
		frames: [
			[798, 260, 448, 223],
			[1183, 0, 210, 62],
			[1393, 0, 210, 62],
			[136, 260, 214, 212],
			[784, 68, 141, 141],
			[242, 0, 45, 44],
			[973, 0, 210, 62],
			[763, 0, 210, 62],
			[350, 260, 448, 223]
		]
	})

	world = new createjs.Container();
	world.x = 0;
	world.y = 0;

	obstacles = new createjs.Container();

	for (var idx = 0; idx < mapData.layers.length; idx++) {
		var layerData = mapData.layers[idx];
		if (layerData.type == 'tilelayer') {
			initLayer(layerData, tilesetSheet, roadTiles.tilewidth, roadTiles.tileheight);
		} else if (layerData.type == 'objectgroup') {
			initObjects(layerData, objectsSprites);
		}
	}

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

			world.addChild(cellBitmap);
		}
	}
}

var objectConvert = [
	'tribune_full.png',
  'barrier_red.png',
	'barrier_red_race.png',
	'tree_large.png',
	'tree_small.png',
	'cone_straight.png',
	'barrier_white.png',
	'barrier_white_race.png',
	'tribune_empty.png'
]

function initObjects(layer, objectsSprites) {
	for (var i = 0; i < layer.objects.length; i++) {
		var heighDiff = objectsData.frames[layer.objects[i].name].frame.h;
		var objectBitmap = new createjs.Sprite(objectsSprites);
		objectBitmap.gotoAndStop(objectConvert.indexOf(layer.objects[i].name));
		objectBitmap.height = layer.objects[i].height;
		objectBitmap.width = layer.objects[i].width;
		objectBitmap.x = layer.objects[i].x - 2176;
		objectBitmap.y = layer.objects[i].y - 1536 - objectBitmap.height;
		var degree = layer.objects[i].rotation;
		var radians = degree * (Math.PI / 180);
		objectBitmap.rotation = layer.objects[i].rotation;
		objectBitmap.box = new SAT.Box(new SAT.Vector(objectBitmap.x, objectBitmap.y), objectBitmap.width, objectBitmap.height).toPolygon();
		objectBitmap.box.setAngle(radians);

		obstacles.addChild(objectBitmap);
	}
	world.addChild(obstacles);
}
