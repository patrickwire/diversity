var gamejs = require('gamejs');

exports.View = function(display) {
    this.player = require('player').pleyer;
    this.onTick = function() {
        display.clear();
        display.blit((new gamejs.font.Font('30px Sans-serif')).render('DA GAME'));
        this.player.draw(display);
    };

    this.onEvent = function(event) {};
    return this;
};
