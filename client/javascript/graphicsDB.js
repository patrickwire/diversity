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
  surface.blit(image, [-32 * constants.moodGraphicsOrder[mood], -32 * 6]);
  return surface;
};

var bulletDeathCache = {};

exports.getBulletDeathAnimation = function(mood) {
  if (bulletDeathCache[mood]) {
    return bulletDeathCache[mood];
  }

  image = image || gamejs.image.load(constants.graphics.player);
  var ret = [];
  var i;
  for (i = 0; i < 5; i++) {
    var surface = new gamejs.Surface(32, 32);
    surface.blit(image, [-32 * i, -32 * (7 + constants.moodGraphicsOrder[mood])]);
    ret.push(surface);
  }

  bulletDeathCache[mood] = ret;
  return ret;
};
