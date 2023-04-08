import { Controller, Post, UseGuards} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';

import { HomeService } from './home.service';

import { UserService } from '../db/user/user.service';

import { RelationService } from '../db/relation/relation.service'; 
import { User } from '../db/user/user.entity';

@Controller("home")
export class HomeController
{
	constructor(private readonly homeService: HomeService, private readonly userService: UserService, private readonly relationService: RelationService)
	{

	}

	@Post('askfriend')
	//@UseGuards(AuthGuard)
	async AskFriend()
	{
		/*let i = 1;
		while (i < 20)
		{
			let newuser: User = new User();
			newuser.name = "aurel" + i;
			newuser.token = "55";
			newuser.uid = 55;
			newuser.registered = true;
			await this.userService.create(newuser)
			i++;
		}*/
		let u1 = await this.userService.findOneById(1); //aurel
		let u2 = await this.userService.findOneById(2); //charle
		let u3 = await this.userService.findOneById(3); //charle
		let u4 = await this.userService.findOneById(4); //charle
		let u5 = await this.userService.findOneById(5); //charle
		let u6 = await this.userService.findOneById(6); //charle
		let u7 = await this.userService.findOneById(7); //charle
		let u8 = await this.userService.findOneById(8); //charle
		let u9 = await this.userService.findOneById(9); //charle
		let u10 = await this.userService.findOneById(10); //charle
		let u11 = await this.userService.findOneById(11); //charle
		let u12 = await this.userService.findOneById(12); //charle
		if (u1 && u2 && u3 && u4 && u5 && u6 && u7 && u8 && u9 && u10 && u11 && u12)
		{
			/*await this.relationService.createRequest(u1, u2);
			await this.relationService.createRequest(u1, u3);
			await this.relationService.createRequest(u1, u4);
			await this.relationService.createRequest(u1, u5);
			await this.relationService.createRequest(u1, u6);
			await this.relationService.createRequest(u7, u1);
			await this.relationService.createRequest(u8, u1);
			await this.relationService.createRequest(u9, u1);
			await this.relationService.createRequest(u10, u1);
			await this.relationService.createRequest(u11, u1);
			await this.relationService.createRequest(u12, u1);*/

		await this.relationService.acceptRequest(u2, u1);
		await this.relationService.acceptRequest(u3, u1);
		await this.relationService.acceptRequest(u4, u1);

		await this.relationService.acceptRequest(u12, u3);

		await this.relationService.refuseRequest(u5, u1);
		await this.relationService.refuseRequest(u6, u1);

		await this.relationService.Ignore(u6, u1);

		await this.relationService.deleteFriend(u2, u1);
		await this.relationService.deleteFriend(u3, u1);
		await this.relationService.deleteFriend(u4, u1);

		}
	}
}
