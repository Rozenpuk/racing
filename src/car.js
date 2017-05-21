var resources = require('./resources');

var carsData = resources.getResource('cars.json');
var carsImage = resources.getResource('cars.png');
var carSprite;

var car = module.exports = {}
//
Object.defineProperty(car, 'rotation', {
  get: function() {
    return carContainer.rotation;
  },
  set: function(value) {
    carContainer.rotation = value;
  }
});

car.init = function(stage) {
  var carNumber = 0;
  var carsNames = Object.keys(carsData.frames);
  var carInfo = carsData.frames[carsNames[carNumber]].frame;

  carSprite = new Image();
  carSprite.src = carsImage;

  carContainer = new createjs.Container();

  // addCar(gameStage);
  //
  // function addCar(gameStage) {
  //
  //   console.log(carInfo);
  // }

  var carImage = new createjs.SpriteSheet({
    images : [carSprite],
    frames : [[carInfo.x, carInfo.y, carInfo.w, carInfo.h, 0, carInfo.w/2, carInfo.h/2]]
  });

  carBitmap = new createjs.Sprite(carImage);
  carBitmap.gotoAndPlay(0);
  // stage.addChild(carBitmap);
  stage.addChild(carContainer);

  carContainer.addChild(carBitmap)
  carContainer.x = 400;
  carContainer.y = 300;
  carContainer.rotation = 0;
}
