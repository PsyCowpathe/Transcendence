export default class Paddle
{
	pos = { x: 0, y: 0 };
	rect = { up: 0, down: 0, left: 0, right: 0 };

	constructor(posy: number)
	{
		this.pos.x = 50;
		this.pos.y = posy;
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
	}
}
