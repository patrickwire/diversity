var gamejs = require('gamejs');

var constants = require('constants');

gamejs.preload([
    constants.tmxTileset,
    constants.graphics.player,
    constants.graphics.vignette,
    constants.graphics.vignette_w,
    constants.graphics.splash,
    constants.graphics.outro,
    constants.graphics.intro,
    constants.tmxHappyLevel
].concat(Object.keys(constants.tmxFiles)));
