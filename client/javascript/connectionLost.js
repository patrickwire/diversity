var gamejs = require('gamejs');

exports.ConnectionLostView = function(display) {
    this.onTick = function() {
        display.clear();
        display.blit(
            (new gamejs.font.Font('30px Sans-serif')).render('Server connection lost')
        );
    };

    this.onEvent = function(event) {
    };
};
