var gamejs = require('gamejs');
var constants = require('constants');
var image = null;

exports.getPlayerIconForMood = function(mood) {
  image = image || gamejs.image.load(constants.graphics.player);
  var surface = new gamejs.Surface(32, 32);
  surface.blit(image, [-32 * constants.moodGraphicsOrder[mood], 0]);
  return surface;
};

exports.getBulletIconForMood = function(mood) {
  image = image || gamejs.image.load(constants.graphics.player);
  var surface = new gamejs.Surface(32, 32);
  surface.blit(image, [-32 * constants.moodGraphicsOrder[mood], -32]);
  return surface;
};
