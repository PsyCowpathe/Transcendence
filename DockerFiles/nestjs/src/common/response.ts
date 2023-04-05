import { Response } from 'express'; 

export function sendError(res: Response, code: number, message: string)
{
	return (res.status(400).json
		({
			statusCode : code,
			message : message,
		}));
}

export function sendSuccess(res: Response, code: number, data: any)
{
	return (res.status(200).json(data));
}
