var constants = require('constants');

exports.guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});
};

exports.randomMood = function() {
  return constants.moods[Math.floor(Math.random() * constants.moods.length)];
};

exports.distance = function(posA, posB) {
  var dx = posB[0] - posA[0], dy = posB[1] - posA[1];
  return Math.sqrt((dx * dx) + (dy * dy));
};
