var state = require('gamestate');
var constants = require('constants');
var gamejs = require('gamejs');

function Bullet(start,target) {
    this.image = gamejs.image.load(constants.graphics.bullet);
    this.size = this.image.getSize();

    this.speed = speed;
    this.directionX = player.directionX;

    //Spawn
    if (this.directionX > 0) {
        this.rect = new gamejs.Rect([player.rect.right, player.rect.center[1]], this.size);
    }
    else {
        this.rect = new gamejs.Rect([player.rect.left, player.rect.center[1]], this.size);
    }

    this.update = function(dt) {

        //Collision
        gamejs.sprite.spriteCollide(this, enemies, false).forEach(function(collision) {
            collision.b.damageBy(collision.a.damage);
            collision.a.kill();

            if (player.directionX > 0) {
                collision.b.push(PUSH_X / 2, 0);
            }
            else {
                collision.b.push(PUSH_X / 2, 0);
            }
        });

        //Movement
        var x = this.directionX * this.speed * dt;
        if (map.canMove4(this, x, 0)) {
            map.move(this, x, 0);
        }
        else {
            this.kill();
        }

        //Disappear
        this.existingTime += dt;
        if (this.existingTime >= this.lifeTime) {
            this.kill();
        }
    };

    this.draw = function(display) {
        display.blit(this.image, this.rect);
    };
}