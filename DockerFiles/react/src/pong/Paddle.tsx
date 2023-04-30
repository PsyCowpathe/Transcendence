export default class Paddle
{
	paddle!: HTMLElement;
	pos: number = 0;
	size: number = 0;

	constructor(paddle: HTMLElement | null)
	{
		if (paddle)
			this.paddle = paddle;
		this.pos = parseFloat(getComputedStyle(this.paddle).getPropertyValue("--y"));
		this.pos = 50;
		this.size = 10;
	}

	setSize(h: any)
	{
		this.paddle.style.setProperty("--h", h);
	}

	setPosition(y: any)
	{
		this.pos = y;
		this.paddle.style.setProperty("--y", y);
	}
}
