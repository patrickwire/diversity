var tmx = require('gamejs/tmx');
var Layer = require('layer').Layer;
var constants = require("constants");

exports.MapDB = function(tmxUrl) {
    var map = tmx.Map(tmxUrl);

    var layers = map.layers.map(function(layer) {
      return new Layer(layer, {
         tileWidth: map.tileWidth,
         tileHeight: map.tileHeight,
         width: map.width,
         height: map.height,
         tiles: map.tiles
      },map);
   });

    this.getRandomLayers = function(count) {
        if (count > map.layers.length) {
            throw "not enough layers";
        }

        var views = layers.slice(0);
        var ret = [];

        while (count-- > 0) {
            var index = Math.floor(Math.random() * views.length);
            ret.push(views.splice(index, 1)[0]);
        }

        return ret;
    };

    var layersByMood = {};
    constants.moods.forEach(function(mood) {
        var map = tmx.Map(tmxUrl);
        layersByMood[mood] = [
            new Layer(
                map.layers[0],
                { tileWidth: map.tileWidth,
                  tileHeight: map.tileHeight,
                  width: map.width,
                  height: map.height,
                  tiles: map.tiles
                },
                map
            )
        ];
    });

    this.getLayerForMood = function(mood) {
        return layersByMood[mood][0];
    };
};
