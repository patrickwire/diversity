var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');
log="";
exports.Player = function(position) {


    this.direction = 0;
    this.image = gamejs.image.load(constants.graphics.player);
    this.layers = state.mapDB.getRandomLayers(constants.mapsPerPlayer);
    this.currentLayer = this.layers[0];
    var rect = new gamejs.Rect(position, this.image.getSize());

    this.draw = function(display) {
        display.blit(this.image, rect);
    };
    this.update = function(dt) {

        //Calculate new position
        if(this.direction !== 0){
            var amountX =
                (this.direction%2 *
                    (this.direction+constants.directionOffset.horizontal)) * constants.player.speed * dt;
            var newLeft = rect.left + amountX;
            var amountY = ((1+this.direction)%2 *
                (this.direction+constants.directionOffset.vertical)) * constants.player.speed * dt;
            var newTop = rect.top + amountY;
            log=amountX+' '+amountY+' '+this.direction;
            var newRect = new gamejs.Rect(rect);
            newRect.top = newTop;
            newRect.left = newLeft;

            //Move, if we are still inside the screen afterwards
            if (this.currentLayer.isWalkablePosition(newRect)) {
                rect = newRect;
            }
        }
    };
};
