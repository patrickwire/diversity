var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');
var Bullet = require('game/bullet').Bullet;
var util = require('util');
var graphicsDB = require('graphicsDB');

exports.Player = function(position,view) {
    var ticks=1;
    this.spawn=function(){
        var spawnpoint = this.currentLayer.findObject(constants.spawnTiles);

        if (spawnpoint!==undefined){
            rect.left = spawnpoint[0] + 4;
            rect.top = spawnpoint[1] + 4;
        } else {
            throw "no spawn point found";
        }
    };
    this.id = function() {return state.server.ourId;};
    this.view=view;
    this.bullets = [];
    this.hitpoints = constants.player.startingHitpoints;
    this.mood = util.randomMood();
    this.directionX = 0;
    this.directionY = 0;
    this.image = graphicsDB.getPlayerIconForMood(this.mood);
    this.layers = {};
    constants.moods.forEach($.proxy(
        function(mood) {this.layers[mood] = state.mapDB.getLayerForMood(mood);},
        this
    ));
    this.currentLayer = this.layers[this.mood];
    var rect = new gamejs.Rect(position, [24, 24]);
    this.spawn();
    this.draw = function(display) {
        display.blit(this.image, [rect.left - 4, rect.top - 4]);
    };

    var wallhitcount = 0;
    var justHitWall = false;

    var sadnessTimer = null;

    this.update = function(dt) {
        //Calculate new position
        var amountX =this.directionX * constants.player.speed * dt;
        var newLeft = rect.left + amountX;
        var amountY = this.directionY * constants.player.speed * dt;
        var newTop = rect.top + amountY;

        if (amountX === 0 && amountY === 0) {
            if (sadnessTimer === null) {
                sadnessTimer = setTimeout(
                    $.proxy(function() {this.switchMood('sadness');}, this),
                    constants.player.millisecondsTillSadness
                );
            }
        } else if (sadnessTimer !== null) {
            clearTimeout(sadnessTimer);
            sadnessTimer = null;
        }

        var newRect = new gamejs.Rect(rect);
        newRect.top = newTop;
        newRect.left = newLeft;
        //Move, if we are still inside the screen afterwards
        if (this.currentLayer.isFallablePosition(newRect)) {
            if (this.mood === 'fear' && this.currentLayer.isFearExitPosition(rect)) {
                this.winMood();
            }
            this.switchMood('confusion');
        } else if (this.currentLayer.isWalkablePosition(newRect)) {
            rect = newRect;
            justHitWall = false;
            if (this.mood === 'denial' && this.currentLayer.isDenialExitPosition(rect)) {
                this.winMood();
            }
        } else {
            if (!justHitWall) {
                wallhitcount += 1;
                if (wallhitcount >= constants.player.wallhitsTillAnger) {
                    this.switchMood("anger");
                }
                justHitWall = true;
            }
        }

        if (ticks % 2 === 0) {
            this.publishPosition();
        }
        ticks++;

    };

    this.shot = function (target) {
        if (this.mood === "fear") {
            return;
        }
        if (this.bullets.length >= constants.player.maxBullets) {
            return;
        }
        if (sadnessTimer !== null) {
            clearTimeout(sadnessTimer);
            sadnessTimer = null;
        }
        var start = rect.center;
        var bull = new Bullet(start, target, this);
        this.bullets.push(bull);
    };

    this.publishPosition = function() {
        var bull=[];
        $(this.bullets).each(function(){
           if(this.visible){
               bull.push({x:this.rect.left,y:this.rect.top,directionX:this.directionX,directionY:this.directionY});
           }
        });
        state.server.connection.send(JSON.stringify({
            type: "PlayerStatus",
            id: state.server.ourId,
            position: [rect.left, rect.top],
            mood: this.mood,
            bullets: bull
        }));
    };

    var confusionTimer = null;

    this.switchMood = function(mood) {
        wallhitcount = 0;
        justHitWall = false;

        if (sadnessTimer !== null) {
            clearTimeout(sadnessTimer);
            sadnessTimer = null;
        }

        if (confusionTimer !== null) {
            clearTimeout(confusionTimer);
            confusionTimer = null;
        }

        this.mood = mood;
        this.currentLayer = this.layers[mood];
        this.image = graphicsDB.getPlayerIconForMood(mood);
        this.spawn();
        console.log("now in mood " + this.mood);

        if (this.mood === "confusion") {
            if (confusionTimer !== null) {
                clearTimeout(confusionTimer);
                confusionTimer = null;
            }

            confusionTimer = setTimeout(
                $.proxy(
                    function() {
                        if (this.mood === "confusion") {
                            this.winMood();
                        }
                    },
                    this
                ),
                constants.player.millisecondsTillConfusionWon
            );
        }

    };

    var wonMoods = {};
    constants.moods.forEach(function(mood) {wonMoods[mood] = false;});

    this.winMood = function() {
        if (wonMoods[this.mood]) {
            return;
        }
        console.log("won " + this.mood);
        wonMoods[this.mood] = true;
        var allWon = true;
        constants.moods.forEach(function(mood) {
            if (!wonMoods[mood]) {
                allWon = false;
            }
        });
        if (allWon) {
            alert("HAPPY!HAPPY!HAPPY!");
        }
    };

    this.checkSadnessWin = function(others) {
        if (this.mood !== "sadness" || wonMoods.sadness) {
            return;
        }

        var win = Object.keys(others).some(function(otherKey) {
            var other = others[otherKey];
            var dist = util.distance(rect.topleft, other.getPosition());
            return dist <= constants.player.maxDistanceToOthersForSadnessWin;
        });

        if (win) {
            this.winMood();
        }
    };
    this.getPos=function(){
        return rect.center;
    };
};
