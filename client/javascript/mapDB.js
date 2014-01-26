var tmx = require('gamejs/tmx');
var Layer = require('layer').Layer;
var constants = require("constants");

exports.MapDB = function() {
    var layersByMood = {};
    constants.moods.forEach(function(mood) {
        var map = new tmx.Map(constants.tmxFiles[mood]);
        layersByMood[mood] = [
            new Layer(
                map.layers[0],
                { tileWidth: map.tileWidth,
                  tileHeight: map.tileHeight,
                  width: map.width,
                  height: map.height,
                  tiles: map.tiles
                },
                map,
                mood
            )
        ];
    });

    this.getLayerForMood = function(mood) {
        return layersByMood[mood][0];
    };
};
