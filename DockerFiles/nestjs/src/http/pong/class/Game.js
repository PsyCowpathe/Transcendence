"use strict";
exports.__esModule = true;

var Ball_1 = require("./Ball");
var Paddle_1 = require("./Paddle");

var Game = /** @class */ (function () {
	function Game(p1, p2, tag)
	{
        	this.deltaTime = 0;
        	this.prevTime = 0;
        	this.ball = new Ball_1["default"]();
        	this.p1_paddle = new Paddle_1["default"](3);
        	this.p2_paddle = new Paddle_1["default"](96);
        	this.p1_ready = false;
        	this.p2_ready = false;
        	this.playing = false;
        	this.GOAL = false;
        	this.p1 = p1;
        	this.p2 = p2;
        	this.tag = tag;
        	this.ball.reset();
    	}

	Game.prototype.moveBall = function () {
        var ballrect = this.ball.getRect();
        var p1_paddlerect = this.p1_paddle.getRect();
        var newdir = { x: 0, y: 0 };
        var newpos = { x: 0, y: 0 };
        if (ballrect.up <= 20)
            this.ball.dir.y = Math.abs(this.ball.dir.y);
        else if (ballrect.down >= 80)
            this.ball.dir.y = -Math.abs(this.ball.dir.y);
        if (this.ball.pos.x < 15) {
            var p1_paddlerect_1 = this.p1_paddle.getRect();
            if (ballrect.left <= p1_paddlerect_1.right &&
                ballrect.up <= p1_paddlerect_1.down &&
                ballrect.down >= p1_paddlerect_1.up &&
                this.ball.pos.x >= p1_paddlerect_1.left) {
                var rad = ((this.ball.pos.y - this.p1_paddle.pos.y) / 20);
                newdir = { x: Math.cos(rad * Math.PI),
                    y: Math.sin(rad * Math.PI) };
                this.ball.setDirection(newdir);
                this.ball.speed = this.ball.GAME_SPEED;
            }
        }
        else if (this.ball.pos.x > 75) {
            var p2_paddlerect = this.p2_paddle.getRect();
            if (ballrect.right >= p2_paddlerect.left &&
                ballrect.up <= p2_paddlerect.down &&
                ballrect.down >= p2_paddlerect.up &&
                this.ball.pos.x <= p2_paddlerect.right) {
                var rad = ((this.ball.pos.y - this.p2_paddle.pos.y) / 20);
                newdir = { x: -Math.cos(rad * Math.PI),
                    y: Math.sin(rad * Math.PI) };
                this.ball.setDirection(newdir);
                this.ball.speed = this.ball.GAME_SPEED;
                this.ball.wasHit = true;
            }
        }
        newpos = { x: this.ball.pos.x + (this.ball.dir.x * this.ball.speed * this.deltaTime),
            y: this.ball.pos.y + (this.ball.dir.y * this.ball.speed * this.deltaTime) };
        this.ball.setPosition(newpos);
    };
    Game.prototype.GOOOAAAAAAL = function () {
        if (this.ball.pos.x > 50)
            this.p1.score++;
        else
            this.p2.score++;
        this.GOAL = true;
        this.ball.reset();
    };
    Game.prototype.update = function (time) {
        if (this.prevTime) {
            this.deltaTime = time - this.prevTime;
            this.moveBall();
            if (this.ball.pos.x >= 99.9 || this.ball.pos.x <= 0.1)
                this.GOOOAAAAAAL();
        }
        this.prevTime = time;
    };
    Game.prototype.getGameState = function () {
        return ({
            ballpos: this.ball.pos,
            p1_paddlepos: this.p1_paddle.pos,
            p2_paddlepos: this.p2_paddle.pos
        });
    };
    return Game;
}());
exports["default"] = Game;
