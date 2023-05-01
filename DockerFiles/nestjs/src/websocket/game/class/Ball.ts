export default class Ball
{
	BASE_SPEED:number = 0.0333;
	GAME_SPEED:number = 0.0666;
	
	pos = { x: 0, y: 0 };
	dir = { x: 0, y: 0 };
	rect = { up: 0, down: 0, left: 0, right: 0 };
	speed: number = 0;

	constructor ()
	{
	}

	getRandomDirection ()
	{
		let dir = { x: 0, y: 0 };
		while (!dir.x || dir.y < -0.5 || dir.y > 0.5)
		{
			const rgn = Math.random() * 2 * Math.PI;

			dir = { x: Math.cos(rgn), y: Math.sin(rgn) };
		}
		this.rect = { up: this.pos.y - 0.75, down: this.pos.y + 0.75, left: this.pos.x - 0.75, right: this.pos.x + 0.75 };
		return (dir);
	}

	setPosition (pos:{x:any, y:any})
	{
		if (pos.x >= -1 && pos.x <= 101)
			this.pos.x = pos.x;
		if (pos.y >= -1 && pos.y <= 61)
			this.pos.y = pos.y;
	}
	
	setDirection (dir:{x:any, y:any})
	{
		this.dir.x = dir.x;
		this.dir.y = dir.y;
	}

	getRect()
	{
		this.rect = { up: this.pos.y - 0.75, down: this.pos.y + 0.75, left: this.pos.x - 0.75, right: this.pos.x + 0.75 };
		return (this.rect);
	}

	reset()
	{
		const pos = { x: 50, y:30 };
		this.setPosition(pos);
		this.dir = this.getRandomDirection();
		this.speed = this.BASE_SPEED;
	}
}
