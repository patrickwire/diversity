var gamejs = require('gamejs');
var Player = require('final/player').Player;
var Layer = require('layer').Layer;
var state = require('gamestate');
var constants = require('constants');
var AbortedView = require('aborted').AbortedView;

exports.View = function(display,realdisplay) {
    this.offset=[0,0];
    var keys = {
        LEFT:false,
        RIGHT:false,
        UP:false,
        DOWN:false
    };
    var player = new Player([4,4],this);


    var drawBackground = function() {
        var offset=player.getPos();
        player.currentLayer.draw(state.display,offset);
    };




    this.onTick = function() {
        var dt =0.06;

        player.update(dt);


        display.clear();
        drawBackground();

        player.draw(state.display);




        realdisplay.clear();
        gamejs.draw.rect(realdisplay, "rgba(0,0,0,1)", new gamejs.Rect([0,0],[600,360]),0);
        var pos =player.getPos();
        pos=[pos[0]-(300),pos[1]-180]
        realdisplay.blit(display,[0,0],new gamejs.Rect(pos, [992, 992]));
        var image = gamejs.image.load(constants.graphics.vignette_w);
        $('body').css('background','#000');
        var surface = new gamejs.Surface(600, 360);
        surface.blit(image, [0, 0]);
        realdisplay.blit(surface, [0,0]);
    };

    this.onEvent = function(event) {
        gamejs.log(1)
        if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_LEFT) {
                keys.LEFT=false;
                player.directionX+=1;
            }
            if (event.key === gamejs.event.K_RIGHT) {
                keys.RIGHT=false;
                player.directionX-=1;
            }
            if (event.key === gamejs.event.K_UP) {
                keys.UP=false;
                player.directionY+=1;
            }
            if (event.key === gamejs.event.K_DOWN) {
                keys.DOWN = false;
                player.directionY-=1;
            }
        }
        if (event.type === gamejs.event.KEY_DOWN) {
            if (event.key === gamejs.event.K_LEFT && !keys.LEFT) {
               player.directionX -= 1;
                keys.LEFT=true;
            }
            if (event.key === gamejs.event.K_RIGHT && !keys.RIGHT) {
                player.directionX +=1;
                keys.RIGHT=true;
            }
            if (event.key === gamejs.event.K_UP && !keys.UP) {
                player.directionY -=1;
                keys.UP=true;
            }
            if (event.key === gamejs.event.K_DOWN && !keys.DOWN) {
                player.directionY+=1;
                keys.DOWN=true;
            }
        }
    };

    return this;
};
