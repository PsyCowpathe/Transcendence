export default class Paddle
{
	paddle!: HTMLElement;
	pos: number = 50;
	y_min: number = 0;
	y_max: number = 0;

	constructor(paddle: HTMLElement | null)
	{
		if (paddle)
			this.paddle = paddle;
		this.pos = parseFloat(getComputedStyle(this.paddle).getPropertyValue("--y"));
		this.y_min = 25;
		this.y_max = 75;
	}

	setSize(h: any)
	{
		this.paddle.style.setProperty("--h", h);
		this.y_min = 20 + (h * 0.5);
		this.y_max = 80 - (h * 0.5);
	}

	setPosition(y: any)
	{
		if (y < this.y_min)
			y = this.y_min;
		if (y > this.y_max)
			y = this.y_max;
		this.pos = y;
		this.paddle.style.setProperty("--y", y);
	}
}
