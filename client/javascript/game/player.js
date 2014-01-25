var gamejs = require('gamejs');

exports.Player = function(position) {
    this.image = gamejs.image.load(PATH.IMG + "player.png");
    this.rect = new gamejs.Rect(position, this.image.getSize());
    this.onTick = function() {

    };

    this.draw = function(display) {
        display.blit(this.image, this.rect);
    };
    this.onEvent = function(event) {};
    return this;
};
