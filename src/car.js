var resources = require('./resources');
var SAT = require('sat');
var hud = require('./hud');

var carsData = resources.getResource('cars.json');
var carsImage = resources.getResource('cars.png');
var carSprite;

var car = module.exports = {}

Object.defineProperties(car, {
  'rotation': {
    get: function() {
      return carContainer.rotation;
    },
    set: function(value) {
      carContainer.rotation = value;
    }
  },
  'velocity': {
    get: function() {
      return carContainer.velocity;
    },
    set: function(value) {
      carContainer.velocity = value;
    }
  },
  'zeroVelocity': {
    get: function() {
      return carContainer.zeroVelocity;
    },
    set: function(value) {
      carContainer.zeroVelocity = value;
    }
  },
  'acceleration': {
    get: function() {
      return carContainer.acceleration;
    },
    set: function(value) {
      carContainer.acceleration = value;
    }
  },
  'maxVelocity': {
    get: function() {
      return carContainer.maxVelocity;
    },
    set: function(value) {
      carContainer.maxVelocity = value;
    }
  },
  'x': {
    get: function() {
      return carContainer.x;
    },
    set: function(value) {
      carContainer.x = value;
    }
  },
  'y': {
    get: function() {
      return carContainer.y;
    },
    set: function(value) {
      carContainer.y = value;
    }
  },
  'box': {
    get: function() {
      return carContainer.box;
    },
    set: function(value) {
      carContainer.box = value;
    }
  }
});

car.init = function(stage, game) {
  var carNumber = 0;
  var carsNames = Object.keys(carsData.frames);
  var carInfo = carsData.frames[carsNames[carNumber]].frame;

  carSprite = new Image();
  carSprite.src = carsImage;

  carContainer = new createjs.Container();

  var carImage = new createjs.SpriteSheet({
    images : [carSprite],
    frames : [[carInfo.x, carInfo.y, carInfo.w, carInfo.h, 0, carInfo.w/2, carInfo.h/2]]
  });

  carBitmap = new createjs.Sprite(carImage);
  carBitmap.gotoAndPlay(0);
  stage.addChild(carContainer);

  carContainer.addChild(carBitmap)
  carContainer.x = game.width/2;
  carContainer.y = game.height/2;
  carContainer.rotation = 0;
  carContainer.velocity = 0;
  carContainer.zeroVelocity = 0.9;
  carContainer.acceleration = 1.025;
  carContainer.maxVelocity = 10;
  carContainer.box = new SAT.Box(new SAT.Vector(carContainer.x,carContainer.y), 71, 131).toPolygon();
  carContainer.box.setOffset({x:-71/2, y:-131/2});
}
