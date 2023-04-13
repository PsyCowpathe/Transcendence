import { Response } from 'express'; 

export function sendError(res: Response, code: number, message: string)
{
	return (res.status(code).json
		({
			statusCode : code,
			message : message,
		}));
}

export function sendSuccess(res: Response, code: number, data: any)
{
	return (res.status(code).json(data));
}
