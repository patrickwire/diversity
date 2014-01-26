var gamejs = require('gamejs');
var Player = require('game/player').Player;
var Bullet = require('game/bullet').Bullet;
var Layer = require('layer').Layer;
var state = require('gamestate');
var constants = require('constants');
var Other = require('game/other').Other;

exports.View = function(display) {

    var keys = {
        LEFT:false,
        RIGHT:false,
        UP:false,
        DOWN:false
    };
    var player = new Player([4,4]);
    player.publishPosition();

    var drawBackground = function() {
        player.currentLayer.draw(state.display);
    };

    state.server.onmessage = $.proxy(function(message) {
        switch (message.type) {
            case "PlayerStatus":
                this.addOrUpdateOtherPlayer(message);
                break;
            case "Hit":
                if (message.playerId === player.id()) {
                    player.hitpoints -= 1;
                    $('.hp-display').append(
                        '<span style="color: ' + constants.moodColors[message.bulletMood] + '">•</span>'
                        );
                    if (player.hitpoints === 1) {
                        player.switchMood("fear");
                    } else if (player.hitpoints === 0) {
                        player.switchMood("sadness");
                        $('.hp-display').empty();
                        player.hitpoints = constants.player.startingHitpoints;
                    }
                }
                break;
            default:
                alert("unknown message");
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
                    player.currentLayer
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

        $.each(player.bullets, function( index, value ) {
            this.draw(display);
        });
    };

    this.onEvent = function(event) {
        if (event.type === gamejs.event.MOUSE_UP) {
            player.shot(event.pos);
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
