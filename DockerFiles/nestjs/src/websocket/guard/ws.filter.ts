import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { WsException, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter
{
	public catch(exception: HttpException, host: ArgumentsHost)
	{
		const client = host.switchToWs().getClient();
		this.handleError(client, exception);
	}

	public handleError(client: Socket, exception: HttpException | WsException)
	{
		if (exception instanceof HttpException)
		{
			let error : any = exception.getResponse();
			if (typeof error === 'string')
			{
				client.emit("ChatError", error);
			}
			else
			{
				client.emit("ChatError", error.message);
				return (error.message);
			}
		}
	}
}
