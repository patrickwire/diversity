var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');
var guid = require('util').guid;
var graphicsDB = require('graphicsDB');

exports.Bullet = function(start,target,shooter) {
    this.visible=true;
    this.shooter = shooter;
    this.mood = shooter.mood;
    this.currentLayer = shooter.currentLayer;
    this.image = graphicsDB.getBulletIconForMood(this.mood);
    this.size = [8, 8];
    this.directionX=target[0]-start[0];
    this.directionY=target[1]-start[1];
    var scalar=Math.sqrt(this.directionX*this.directionX+this.directionY*this.directionY);
    if (scalar !== 0){
        this.directionX/=scalar;
        this.directionY/=scalar;
        this.speed = constants.bullet.speed;
    } else {
        this.speed=0;
    }
    // generate a uuid
    this.id = guid();
    //Spawn
    this.rect = new gamejs.Rect([start[0],start[1]], this.size);

    this.update = function(dt) {
      if (this.visible) {
        //Movement
        if (!isNaN(this.directionX)  || !isNaN(this.directionY)) {
          var x = this.directionX * this.speed * dt;
          var y = this.directionY * this.speed * dt;
          var newRect = new gamejs.Rect(this.rect);
          newRect.top = this.rect.top+y;
          newRect.left = this.rect.left+x;
          //Move, if we are still inside the screen afterwards
          if (this.currentLayer.isWalkablePosition(newRect)) {
            this.rect = newRect;
          }else{
            this.destroy();
          }
        }
      } else {
        this.image = deathAnimation[currentDeathFrame];
        timeSinceDeathAnimChange += dt;
        if (timeSinceDeathAnimChange > 0.1) {
          timeSinceDeathAnimChange = 0;
          currentDeathFrame += 1;

          if (currentDeathFrame === 5) {
            this.shooter.bullets = $.grep(
                this.shooter.bullets,
                $.proxy(function(bullet) {
                  return bullet.id !== this.id;
                }, this)
              );
          }
        }


      }

    };

    var deathAnimation = graphicsDB.getBulletDeathAnimation(this.mood);
    var timeSinceDeathAnimChange = null;
    var currentDeathFrame = 0;

    this.draw = function(display) {
      display.blit(this.image, [this.rect.left - 12, this.rect.top - 12]);
    };


    this.destroy = function() {
      this.visible = false;
      timeSinceDeathAnimChange = 0;
    };
};
