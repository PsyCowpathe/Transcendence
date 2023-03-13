dir : {x, y};

HEIGHT 100
WIDTH 100;

updatePositions (ballPos, pPaddlePos, oPaddlePos)
{
	ballPos = { ballPos.x * window.innerWidth / 100, ballPos.y}
}
