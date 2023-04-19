export default class Paddle
{
	paddle!: HTMLElement;
	pos!: number;

	constructor(paddle: HTMLElement | null)
	{
		if (paddle)
			this.paddle = paddle;
		this.pos = parseFloat(getComputedStyle(this.paddle).getPropertyValue("--y"));
	}

	setPosition(y: any)
	{
		if (y < 25)
			y = 25;
		else if (y > 75)
			y = 75;
		this.pos = y;
		this.paddle.style.setProperty("--y", y);
	}
}
