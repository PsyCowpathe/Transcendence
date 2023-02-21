import {TypeOrmModuleOptions} from '@nestjs/typeorm';

const typeOrmConfig : TypeOrmModuleOptions = {
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'postgres',
password: 'daddy',
entities:['app.entity.ts'],
database: 'postgres',
synchronize:true,
};

export default typeOrmConfig;