var tmx = require('gamejs/tmx');
var LayerView = require('layerView').LayerView;

exports.MapDB = function(tmxUrl) {
    var map = tmx.Map(tmxUrl);

    var layerViews = map.layers.map(function(layer) {
      return new LayerView(layer, {
         tileWidth: map.tileWidth,
         tileHeight: map.tileHeight,
         width: map.width,
         height: map.height,
         tiles: map.tiles
      });
   });

    this.getRandomLayerViews = function(count) {
        if (count > map.layers.length) {
            throw "not enough layers";
        }

        var views = layerViews.slice(0);
        var ret = [];

        while (count-- > 0) {
            var index = Math.floor(Math.random() * views.length);
            ret.push(views.splice(index, 1)[0]);
        }

        return ret;
    };
};
