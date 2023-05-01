export default class Paddle
{
	size: number = 0;
	pos = { x: 0, y: 0 };
	y_min: number = 0;
	y_max: number = 0;
	sWidth: number = 0;
	sHeight: number = 0;
	rect = { up: 0, down: 0, left: 0, right: 0 };

	constructor(posx: number)
	{
		this.pos.x = posx;
		this.pos.y = 30;
		this.size = 10;
		this.y_min = 5;
		this.y_max = 55;
	}

	getRect()
	{
		this.rect = { right: this.pos.x + 0.35, left: this.pos.x - 0.35, up: this.pos.y - (this.size * 0.5), down: this.pos.y + (this.size * 0.5) };
		return (this.rect);
	}

	shrink(amount: number)
	{
		if (this.size > 1)
		{
			this.size -= amount;
			this.y_min -= (amount * 0.5);
			this.y_max += (amount * 0.5);
		}
	}

	setPosition(y: number)
	{
		if (y < this.y_min)
			y = this.y_min;
		else if (y > this.y_max)
			y = this.y_max;
		this.pos.y = y;
	}
}
