var gamejs = require('gamejs');
var constants = require('constants');

exports.Other = function(id, position, mood) {
  this.id = id;
  this.image = gamejs.image.load(constants.graphics.player);
  var rect = new gamejs.Rect(position, this.image.getSize());
  this.mood = mood;
  this.bullets=new Array();

  this.checkHit = function(bullet) {
    if (rect.collideRect(bullet.rect)) {
      state.server.connection.send(JSON.stringify({
        type: "Hit",
        playerId: this.id,
        bulletId: bullet.id
      }));
      bullet.visible = false;
    }
    return true;
  };

  this.draw = function(display) {
    display.blit(this.image, rect);
  };

  this.update = function(data) {
    rect.left = data.position[0];
    rect.top = data.position[1];
    this.mood = data.mood;
  };
};
