var gamejs = require('gamejs');
var Player = require('game/player').Player;
var LayerView = require('layerView').LayerView;
var state = require('gamestate');
var constants = require('constants');

exports.View = function(display) {


    var player = new Player([1,1]);

    var drawBackground = function() {
        player.currentLayerView.draw(state.display);
    };

    this.onTick = function() {
        player.update(0.03);

        display.clear();
        drawBackground();
        player.draw(state.display)
    };

    this.onEvent = function(event) {
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_LEFT) player.direction=0;
            if (event.key === gamejs.event.K_RIGHT) player.direction=0;
            if (event.key === gamejs.event.K_UP) player.direction=0;
            if (event.key === gamejs.event.K_DOWN) player.direction=0;
        }
        if (event.type === gamejs.event.KEY_DOWN) {
            if (event.key === gamejs.event.K_LEFT) {
               player.direction = constants.directions.LEFT;
                Console.log(player.direction)
            }
        }
    };
    return this;
};
