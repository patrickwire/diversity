var gamejs = require('gamejs');
var constants = require('constants');
/**
 * Layer
 * Renders the layer to a big surface.
 */
exports.Layer = function(layer, opts,map) {

   this.draw = function(display, offset) {
      display.blit(this.surface, offset);
   };

   /** Returns 2-dimensional array of overlapping tiles */
   this.getOverlappingArea = function(rect,offset) {
       if (offset === undefined){
           offset=0;
       }
       var firstColumn = Math.floor((rect.left + offset) / this.tileWidth);
       var lastColumn = Math.floor((rect.right - offset - 1) / this.tileWidth);
       var firstRow = Math.floor((rect.top + offset) / this.tileHeight);
       var lastRow = Math.floor((rect.bottom -offset - 1) / this.tileHeight);

       var ret = [];
       this.tiles.slice(firstRow, lastRow + 1).forEach(function(row) {
           ret.push(row.slice(firstColumn, lastColumn + 1));
       });
       return ret;
   };

    this.getTileProperty = function(id, property){
        var properties = map.tiles.getProperties(id);
        var p;
        for (p in properties) {
            if (properties.hasOwnProperty(p) && p === property) {
                return true;
            }
        }

        return false;
    };

   this.isWalkablePosition = function(rect) {
       if (rect.top < 0 || rect.bottom > constants.map.height ||
               rect.left < 0 || rect.right > constants.map.width){
            return false;
       }
       var overlappingArea = this.getOverlappingArea(rect);
       var invalid = overlappingArea.some(function(row) {
           return row.some(function(tile) {
               return !tile.walkable;
           });
       });
       return !invalid;
   };

   this.isFallablePosition = function(rect) {
       if (rect.top < 0 || rect.bottom > constants.map.height ||
               rect.left < 0 || rect.right > constants.map.width){
                   return false;
               }
       var overlappingArea = this.getOverlappingArea(rect,10);
       var invalid = overlappingArea.some(function(row) {
           return row.some(function(tile) {
               return !tile.fallable;
           });
       });
       return !invalid;
   };


   this.surface = new gamejs.Surface(opts.width * opts.tileWidth, opts.height * opts.tileHeight);
   this.surface.setAlpha(layer.opacity);

   this.tileWidth = opts.tileWidth;
   this.tileHeight = opts.tileHeight;
   this.tiles = [];
   var that =this;
   layer.gids.forEach(function(row, i) {
       this.tiles[i] = [];
       row.forEach(function(gid, j) {
           if (gid ===0) {throw "I dont think this should happen";}
           var tileSurface = opts.tiles.getSurface(gid);
           if (!tileSurface) {throw "this shouldnt happen";}
           this.tiles[i][j] = {
               position: [j * opts.tileWidth, i * opts.tileHeight],
               rect: new gamejs.Rect([j * opts.tileWidth, i * opts.tileHeight],
                                     [opts.tileWidth, opts.tileHeight]),
               walkable: that.getTileProperty(gid,constants.walkableTiles),
               fallable: that.getTileProperty(gid,constants.fallableTiles)
           };
           this.surface.blit(tileSurface, this.tiles[i][j].rect);
      }, this);
   }, this);

   this.findObject = function(property) {
       var x, y, p;
       for (y = 0; y < map.height; y++) {
           for (x = 0; x < map.width; x++) {
               var properties = map.tiles.getProperties(layer.gids[y][x]);
               for (p in properties) {
                   if(properties.hasOwnProperty(p) && p === property) {
                       return ([x * map.tileWidth, y * map.tileHeight]);
                   }
               }
           }
       }
   };
};

