export default class Paddle
{
	paddle!: HTMLElement;
	pos = { x: 0, y: 0 };
	rect = { right: 0, left: 0, up: 0, down: 0 };
	speed: number = 0;

	constructor(paddle: HTMLElement | null)
	{
		if (paddle)
			this.paddle = paddle;
		this.pos.x = 50;
		this.pos = {	x: parseFloat(getComputedStyle(this.paddle).getPropertyValue("--x")),
				y: parseFloat(getComputedStyle(this.paddle).getPropertyValue("--y")) };
		this.rect = { right: 4, left: 3, up: 45, down: 55 };
	}

	getRect()
	{
		this.rect = { right: this.pos.x + 0.5, left: this.pos.x - 0.5, up: this.pos.y - 5, down: this.pos.y + 5 };
		return (this.rect);
	}

	setPosition(y: any)
	{
		if (y < 25)
			y = 25;
		else if (y > 75)
			y = 75;
		this.pos.y = y;
		this.paddle.style.setProperty("--y", y);
	}
}
