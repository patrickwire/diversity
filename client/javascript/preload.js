var gamejs = require('gamejs');

var constants = require('constants');

gamejs.preload([
    constants.tmxTileset,
    constants.tmxFile,
    constants.graphics.player,
    constants.graphics.bullet
]);
