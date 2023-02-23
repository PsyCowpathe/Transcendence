import { Module } from '@nestjs/common';

import { DbController } from './db/db.controller';
import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';

import { UserModule } from './db/user/user.module';

@Module({
  imports: [DbModule, UserModule],
})
export class AppModule {}
