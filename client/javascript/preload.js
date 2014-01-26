var gamejs = require('gamejs');

var constants = require('constants');

gamejs.preload([
    constants.tmxTileset,
    constants.graphics.player,
    constants.graphics.bullet
].concat(Object.keys(constants.tmxFiles)));
