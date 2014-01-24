var gamejs = require('gamejs');

exports.Splash = function(display) {

    this.onTick = function() {
        display.clear();
        display.blit(
            (new gamejs.font.Font('30px Sans-serif')).render('Five Stages of Killing(tm)')
        );
    };

    this.onEvent = function(event) {
        // event handling
    };

    return this;
}
