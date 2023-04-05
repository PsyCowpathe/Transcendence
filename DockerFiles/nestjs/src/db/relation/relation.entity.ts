import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Relation
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, {eager: true})
	@JoinColumn()
	user1: User;

	@ManyToOne(() => User, {eager: true})
	@JoinColumn()
	user2: User;

	@Column()
	type: number;
}

