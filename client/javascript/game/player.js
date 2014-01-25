var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');
log="";
exports.Player = function(position) {

    this.directionX = 0;
    this.directionY = 0;
    this.image = gamejs.image.load(constants.graphics.player);
    this.rect = new gamejs.Rect(position, this.image.getSize());
    this.layers = state.mapDB.getRandomLayers(constants.mapsPerPlayer);
    this.currentLayer = this.layers[0];
    this.draw = function(display) {
        display.blit(this.image, this.rect);
    };
    this.update = function(dt) {

        //Calculate new position

            var amountX =this.directionX * constants.player.speed * dt;
            var newLeft = this.rect.left + amountX;
            var amountY = this.directionY * constants.player.speed * dt;
            var newTop = this.rect.top + amountY;
            //Move, if we are still inside the screen afterwards
            if (newLeft > 0 && newLeft + this.rect.width < constants.map.width) {
                this.rect.moveIp(amountX, 0);
            }
            if (newTop > 0 && newTop + this.rect.height < constants.map.height) {
                this.rect.moveIp(0,amountY);
            }

    };
};
