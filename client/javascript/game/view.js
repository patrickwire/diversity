var gamejs = require('gamejs');
var Player = require('game/player').Player;
var Bullet = require('game/bullet').Bullet;
var Layer = require('layer').Layer;
var state = require('gamestate');
var constants = require('constants');
var Other = require('game/other').Other;
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
    player.publishPosition();

    var drawBackground = function() {
        var offset=player.getPos();
        gamejs.log(offset);
        player.currentLayer.draw(state.display,offset);
    };

    state.server.onmessage = $.proxy(function(message) {
        switch (message.type) {
            case "PlayerStatus":
                this.addOrUpdateOtherPlayer(message);
                break;
            case "Hit":
                if (message.playerId === player.id()) {
                    player.hitpoints -= 1;
                    player.lastHit =0;
                    $('.hp-display').append(
                        '<span style="color: ' + constants.moodColors[message.bulletMood] + '">•</span>'
                        );
                    if (player.hitpoints === 1) {
                        player.switchMood("fear");
                    } else if (player.hitpoints === 0) {
                        player.switchMood("denial");
                        $('.hp-display').empty();
                        player.hitpoints = constants.player.startingHitpoints;
                        state.server.connection.send(JSON.stringify({
                            type: "Kill",
                            killerId: message.playerId
                        }));
                    }
                }
                break;
            case "Kill":
                if (player.mood === "anger") {
                    player.winMood();
                }
                break;
            case "PlayerLeft":
                delete otherPlayers[message.playerId];
                break;
            default:
                throw "unknown message";
        }
    }, this);

    var otherPlayers = {};

    this.addOrUpdateOtherPlayer = function(data) {
        var i;
        if (otherPlayers[data.id]) {
            otherPlayers[data.id].update(data);
        } else {
            otherPlayers[data.id] = new Other(data.id, data.position, data.mood);
        }
        otherPlayers[data.id].bullets=[];
        for (i in data.bullets){
            if (data.bullets.hasOwnProperty(i)) {
                var bull = new Bullet(
                    [data.bullets[i].x,data.bullets[i].y],
                    [data.bullets[i].x,data.bullets[i].y],
                    otherPlayers[data.id]
                );
                otherPlayers[data.id].bullets.push(bull);
            }
        }
    };

    this.onTick = function() {
        var dt =0.06;

        player.update(dt);
        $.each(player.bullets, function( index, bullet ) {
            bullet.update(dt);
            if (bullet.visible) {
                $.each(otherPlayers, function(opIdx, other) {
                    other.checkHit(bullet);
                });
            }
        });

        display.clear();
        drawBackground();

        player.draw(state.display);
        $.each(otherPlayers, function(idx, other) {
            other.draw(display);
            $.each(other.bullets, function( index, value ) {
                this.draw(display);
            });
        });

        player.checkSadnessWin(otherPlayers);

        $.each(player.bullets, function( index, value ) {
            this.draw(display);
        });
        realdisplay.clear();
        gamejs.draw.rect(realdisplay, "rgba(0,0,0,1)", new gamejs.Rect([0,0],[600,360]),0);
        var pos =player.getPos();
        pos=[pos[0]-(300),pos[1]-180]
        realdisplay.blit(display,[0,0],new gamejs.Rect(pos, [992, 992]));
        var image = gamejs.image.load(constants.graphics.vignette);
        var surface = new gamejs.Surface(600, 360);
        surface.blit(image, [0, 0]);
        realdisplay.blit(surface, [0,0]);
    };

    this.onEvent = function(event) {
        if (event.type === gamejs.event.MOUSE_UP) {
            var pos =player.getPos();
            pos=[pos[0]-(300)+event.pos[0],pos[1]-180+event.pos[1]];
            player.shot(pos);
        }
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
