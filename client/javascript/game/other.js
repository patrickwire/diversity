var gamejs = require('gamejs');
var state = require('gamestate');
var constants = require('constants');
var graphicsDB = require('graphicsDB');

exports.Other = function(id, position, mood) {
  this.id = id;
  var rect = new gamejs.Rect(position, [24, 24]);
  this.mood = mood;
  this.bullets = [];
  this.image = graphicsDB.getPlayerIconForMood(this.mood);
  this.lastHit=2;
  this.checkHit = function(bullet) {
    if (rect.collideRect(bullet.rect)) {
        this.lastHit=0;
      state.server.connection.send(JSON.stringify({
        type: "Hit",
        playerId: this.id,
        bulletId: bullet.id,
        bulletMood: bullet.mood
      }));
      bullet.destroy();
    }
    return true;
  };

  this.draw = function(display) {
    if(this.lastHit<0.5||this.lastHit>1)
        display.blit(this.image, [rect.left - 4, rect.top - 4]);
  };

  this.getPosition = function() {return rect.topleft;};

  this.update = function(data) {
    this.lastHit += 0.06;
    rect.left = data.position[0];
    rect.top = data.position[1];
    if (data.mood !== this.mood) {
      this.mood = data.mood;
      this.image = graphicsDB.getPlayerIconForMood(data.mood);
    }
  };
};
