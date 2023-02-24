/*import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware
{
	use(req: Request, res: Response, next: NextFunction)
	{
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		next();
	}
}*/

/*import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from "express";

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware
{
    use(req: Request, res: Response, next: () => void)
    {
        if (!req.secure)
        {
            const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
            res.redirect(HttpStatus.PERMANENT_REDIRECT, httpsUrl);
        }
        else
        {
            next();
        }
    }
}*/
