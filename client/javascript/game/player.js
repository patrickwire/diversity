var state = require('gamestate');
var constants = require('constants');

exports.Player = function() {
    this.layers = state.mapDB.getRandomMaps(constants.mapsPerPlayer);
};
