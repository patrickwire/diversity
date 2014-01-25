var state = require('gamestate');
var constants = require('constants');

exports.Player = function() {
    this.layerViews = state.mapDB.getRandomLayerViews(constants.mapsPerPlayer);
    this.currentLayerView = this.layerViews[0];
};
