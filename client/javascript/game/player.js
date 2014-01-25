var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');
var Bullet = require('game/bullet').Bullet;
var util = require('util');
var graphicsDB = require('graphicsDB');

exports.Player = function(position,view) {

    this.spawn=function(){
        var spawnpoint=this.currentLayer.findObject(constants.spawnTiles);
        if(spawnpoint!==undefined){
            rect.left = spawnpoint[0] + 4;
            rect.top = spawnpoint[1] + 4;
        }
    };
    this.id = function() {return state.server.ourId;};
    this.view=view;
    this.bullets = [];
    this.hitpoints = constants.player.startingHitpoints;
    this.mood = util.randomMood();
    this.directionX = 0;
    this.directionY = 0;
    this.image = graphicsDB.getPlayerIconForMood(this.mood);
    this.layers = state.mapDB.getRandomLayers(constants.mapsPerPlayer);
    this.currentLayer = this.layers[0];
    var rect = new gamejs.Rect(position, [24, 24]);
    this.spawn();
    this.draw = function(display) {
        display.blit(this.image, [rect.left - 4, rect.top - 4]);
    };
    this.update = function(dt) {

        //Calculate new position
        var amountX =this.directionX * constants.player.speed * dt;
        var newLeft = rect.left + amountX;
        var amountY = this.directionY * constants.player.speed * dt;
        var newTop = rect.top + amountY;

        var newRect = new gamejs.Rect(rect);
        newRect.top = newTop;
        newRect.left = newLeft;
        //Move, if we are still inside the screen afterwards
        if (this.currentLayer.isWalkablePosition(newRect)) {
            rect = newRect;
        }
        if (this.currentLayer.isFallablePosition(newRect)) {

           this.currentLayer = this.layers[Math.floor(Math.random()*this.layers.length%this.layers.length)];
            this.spawn();
        }
        if(ticks%2==0)
        this.publishPosition();
        ticks++;

    };
    this.shot =function (target){

        var start=rect.center;
        var bull=new Bullet(start,target,this.currentLayer);
        this.bullets.push(bull);
    };

    this.publishPosition = function() {
        var bull=[];
        $(this.bullets).each(function(){
           if(this.visible){
               bull.push({x:this.rect.left,y:this.rect.top,directionX:this.directionX,directionY:this.directionY})
           }
        });
        state.server.connection.send(JSON.stringify({
            type: "PlayerStatus",
            id: state.server.ourId,
            position: [rect.left, rect.top],
            mood: this.mood,
            bullets: bull
        }));
    };
};
