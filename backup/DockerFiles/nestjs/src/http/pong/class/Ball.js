"use strict";
exports.__esModule = true;
var Ball = /** @class */ (function () {
    function Ball() {
        this.BASE_SPEED = 0.0333;
        this.GAME_SPEED = 0.0666;
        this.pos = { x: 0, y: 0 };
        this.dir = { x: 0, y: 0 };
        this.rect = { up: 0, down: 0, left: 0, right: 0 };
        this.speed = 0;
        this.wasHit = true;
    }
    Ball.prototype.getRandomDirection = function () {
        var dir = { x: 0, y: 0 };
        while (!dir.x || dir.y < -0.5 || dir.y > 0.5) {
            var rgn = Math.random() * 2 * Math.PI;
            dir = { x: Math.cos(rgn), y: Math.sin(rgn) };
        }
        this.rect = { up: this.pos.y - 0.5, down: this.pos.y + 0.5, left: this.pos.x - 0.5, right: this.pos.x + 0.5 };
        return (dir);
    };
    Ball.prototype.setPosition = function (pos) {
        if (pos.x >= -1 && pos.x <= 101)
            this.pos.x = pos.x;
        if (pos.y >= -1 && pos.y <= 101)
            this.pos.y = pos.y;
    };
    Ball.prototype.setDirection = function (dir) {
        this.dir.x = dir.x;
        this.dir.y = dir.y;
    };
    Ball.prototype.getRect = function () {
        this.rect = { up: this.pos.y - 0.5, down: this.pos.y + 0.5, left: this.pos.x - 0.5, right: this.pos.x + 0.5 };
        return (this.rect);
    };
    Ball.prototype.reset = function () {
        var pos = { x: 50, y: 50 };
        this.setPosition(pos);
        this.dir = this.getRandomDirection();
        this.speed = this.BASE_SPEED;
        this.wasHit = false;
        this.dir.x = 1;
        this.dir.y = 0;
    };
    return Ball;
}());
exports["default"] = Ball;
