var gamejs = require('gamejs');
var Player = require('game/player').Player;
var Layer = require('layer').Layer;
var state = require('gamestate');
var constants = require('constants');

exports.View = function(display) {

    var keys = {
        LEFT:false,
        RIGHT:false,
        UP:false,
        DOWN:false
    };
    var player = new Player([1,1]);

    var drawBackground = function() {
        player.currentLayer.draw(state.display);
    };

    this.onTick = function() {
        var dt =0.06;
        player.update(dt);
        $.each(player.bullets, function( index, value ) {
            this.update(dt);
        });
        display.clear();
        drawBackground();
        player.draw(state.display);
        $.each(player.bullets, function( index, value ) {
            this.draw(display);
        });
    };

    this.onEvent = function(event) {
        if (event.type === gamejs.event.MOUSE_UP) {
            player.shot(event.pos);
        }
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_LEFT) {
                keys.LEFT=false;
                player.directionX+=1;
            }
            if (event.key === gamejs.event.K_RIGHT) {
                keys.RIGHT=false;
                player.directionX-=1;
            }
            if (event.key === gamejs.event.K_UP) {
                keys.UP=false;
                player.directionY+=1;
            }
            if (event.key === gamejs.event.K_DOWN) {
                keys.DOWN = false;
                player.directionY-=1;
            }
        }
        if (event.type === gamejs.event.KEY_DOWN) {
            if (event.key === gamejs.event.K_LEFT && !keys.LEFT) {
               player.directionX -= 1;
                keys.LEFT=true;
            }
            if (event.key === gamejs.event.K_RIGHT && !keys.RIGHT) {
                player.directionX +=1;
                keys.RIGHT=true;
            }
            if (event.key === gamejs.event.K_UP && !keys.UP) {
                player.directionY -=1;
                keys.UP=true;
            }
            if (event.key === gamejs.event.K_DOWN && !keys.DOWN) {
                player.directionY+=1;
                keys.DOWN=true;
            }
        }
    };
    return this;
};
