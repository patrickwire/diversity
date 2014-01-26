var gamejs = require('gamejs');

exports.AbortedView = function(display) {
    this.onTick = function() {
        display.clear();
        display.blit(
            (new gamejs.font.Font('30px Sans-serif')).render('The game has been aborted')
        );
    };

    this.onEvent = function(event) {
    };
};
