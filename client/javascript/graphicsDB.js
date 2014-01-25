var gamejs = require('gamejs');
var constants = require('constants');

exports.getPlayerIconForMood = function(mood) {
  var image = gamejs.image.load(constants.graphics.player);
  var surface = new gamejs.Surface(32, 32);
  surface.blit(image, [-32 * constants.moodGraphicsOrder[mood], 0]);
  return surface;
};
