var tmx = require('gamejs/tmx');
var Layer = require('layer').Layer;
var constants = require("constants");

exports.MapDB = function() {
    var layersByMood = {};
    constants.moods.forEach(function(mood) {
        layersByMood[mood] = constants.tmxFiles[mood].map(function(filename) {
            var map = new tmx.Map(filename);
            return new Layer(
                map.layers[0],
                { tileWidth: map.tileWidth,
                  tileHeight: map.tileHeight,
                  width: map.width,
                  height: map.height,
                  tiles: map.tiles
                },
                map,
                mood
            );
        });
    });

    this.getLayerForMood = function(mood) {
        return layersByMood[mood][Math.floor(Math.random() * layersByMood[mood].length)];
    };
    this.getHappyLevel=function(){
        var map = new tmx.Map(constants.tmxHappyLevel);

        return new Layer(
            map.layers[0],
            { tileWidth: map.tileWidth,
                tileHeight: map.tileHeight,
                width: map.width,
                height: map.height,
                tiles: map.tiles
            },
            map,
            'happy'
        );

    };
};
