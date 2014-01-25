var gamejs = require('gamejs');
/**
 * Layer
 * Renders the layer to a big surface.
 */
exports.Layer = function(layer, opts) {

   this.draw = function(display, offset) {
      display.blit(this.surface, offset);
   };
   /**
    * constructor
    */
   this.surface = new gamejs.Surface(opts.width * opts.tileWidth, opts.height * opts.tileHeight);
   this.surface.setAlpha(layer.opacity);
   /**
    * Note how below we look up the "gid" of the tile images in the TileSet from the Map
    * ('opt.tiles') to get the actual Surfaces.
    */
   layer.gids.forEach(function(row, i) {
      row.forEach(function(gid, j) {
         if (gid ===0) {return;}

         var tileSurface = opts.tiles.getSurface(gid);
         if (tileSurface) {
            this.surface.blit(tileSurface,
               new gamejs.Rect([j * opts.tileWidth, i * opts.tileHeight], [opts.tileWidth, opts.tileHeight])
            );
         } else {
            gamejs.log('no gid ', gid, i, j, 'layer', i);
         }
      }, this);
   }, this);
   return this;
};

