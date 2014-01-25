var gamejs = require('gamejs');
var Player = require('game/player').Player;
var LayerView = require('layerView').LayerView;
var state = require('gamestate');

exports.View = function(display) {
    var player = new Player();

    var drawBackground = function() {
        player.currentLayerView.draw(state.display);
    };

    this.onTick = function() {
        display.clear();
        drawBackground();
    };

    this.onEvent = function(event) {};
    return this;
};
