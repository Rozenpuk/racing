"use strict";

const files = {
    'lap.json': require('./assets/lap.json'),
    'road.json': require('./assets/road.json'),
    'cars.json': require('./assets/cars.json'),
    'tiles.png': './assets/tiles.png',
    'cars.png': './assets/cars.png'
    // 'car_black_1': './assets/car_black_1.png'
    // 'cars.png': './assets/cars.png'
}

module.exports.getResource = name => {
    if (!files.hasOwnProperty(name))
        throw new Error(`file not found: ${name}`);
    return files[name];
}
