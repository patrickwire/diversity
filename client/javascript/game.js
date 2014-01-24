var gamejs = require('gamejs');

exports.Game = function(display) {
    this.onTick = function() {
        display.clear();
        display.blit((new gamejs.font.Font('30px Sans-serif')).render('DA GAME'));
        //drawBackground();
    };

    this.onEvent = function(event) {};
    return this;
};
