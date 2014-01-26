var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');
var Bullet = require('game/bullet').Bullet;
var util = require('util');
var MapDB = require('mapDB').MapDB;

var graphicsDB = require('graphicsDB');

exports.Player = function(position,view) {
    var ticks=1;
    this.lastHit=2;
    this.spawn=function(){
        var spawnpoint = this.currentLayer.findObject(constants.spawnTiles);

        if (spawnpoint!==undefined){
            rect.left = spawnpoint[0] + 4;
            rect.top = spawnpoint[1] + 4;
        } else {
            throw "no spawn point found";
        }
    };

    this.view=view;
    this.bullets = [];
    this.hitpoints = constants.player.startingHitpoints;
    this.directionX = 0;
    this.directionY = 0;
    this.image =  graphicsDB.getPlayerIconForMood('happy');
    this.layers = {};

    this.currentLayer = state.mapDB.getHappyLevel();
    var rect = new gamejs.Rect(position, [24, 24]);
    this.spawn();
    this.draw = function(display) {
        display.blit(this.image, [rect.left - 4, rect.top - 4]);
    };

    var wallhitcount = 0;
    var justHitWall = false;

    var sadnessTimer = null;

    this.update = function(dt) {
        //Calculate new position
        var amountX =this.directionX * constants.player.speed * dt;
        var newLeft = rect.left + amountX;
        var amountY = this.directionY * constants.player.speed * dt;
        var newTop = rect.top + amountY;
        this.lastHit += dt;

        gamejs.log(amountY)
        gamejs.log(amountX)
        var newRect = new gamejs.Rect(rect);
        newRect.top = newTop;
        newRect.left = newLeft;
        //Move, if we are still inside the screen afterwards
       if (this.currentLayer.isWalkablePosition(newRect)) {
            rect = newRect;
            justHitWall = false;
        }


    };


    this.getPos=function(){
        return rect.center;
    };
};
