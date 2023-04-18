"use strict";
exports.__esModule = true;
var Paddle = /** @class */ (function () {
    function Paddle(posy) {
        this.pos = { x: 0, y: 0 };
        this.rect = { up: 0, down: 0, left: 0, right: 0 };
        this.pos.x = 50;
        this.pos.y = posy;
    }
    Paddle.prototype.getRect = function () {
        this.rect = { right: this.pos.x + 0.5, left: this.pos.x - 0.5, up: this.pos.y - 5, down: this.pos.y + 5 };
        return (this.rect);
    };
    Paddle.prototype.setPosition = function (y) {
        if (y < 25)
            y = 25;
        else if (y > 75)
            y = 75;
        this.pos.y = y;
    };
    return Paddle;
}());
exports["default"] = Paddle;
