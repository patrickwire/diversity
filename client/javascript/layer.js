var gamejs = require('gamejs');
var constants = require('constants');
/**
 * Layer
 * Renders the layer to a big surface.
 */
exports.Layer = function(layer, opts) {

   this.draw = function(display, offset) {
      display.blit(this.surface, offset);
   };

   /** Returns 2-dimensional array of overlapping tiles */
   this.getOverlappingArea = function(rect) {
       var firstColumn = Math.floor(rect.left / this.tileWidth);
       var lastColumn = Math.floor((rect.right - 1) / this.tileWidth);
       var firstRow = Math.floor(rect.top / this.tileHeight);
       var lastRow = Math.floor((rect.bottom - 1) / this.tileHeight);

       var ret = [];
       this.tiles.slice(firstRow, lastRow - firstRow + 1).forEach(function(row) {
           ret.push(row.slice(firstColumn, lastColumn - firstColumn + 1));
       });
       return ret;
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

   this.surface = new gamejs.Surface(opts.width * opts.tileWidth, opts.height * opts.tileHeight);
   this.surface.setAlpha(layer.opacity);

   this.tileWidth = opts.tileWidth;
   this.tileHeight = opts.tileHeight;
   this.tiles = [];
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
               walkable: $.inArray(gid, constants.walkableTiles) !== -1
           };
           this.surface.blit(tileSurface, this.tiles[i][j].rect);
      }, this);
   }, this);
   return this;
};

