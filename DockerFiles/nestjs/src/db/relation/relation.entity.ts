import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Relation
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	@JoinColumn()
	user1: User;

	@ManyToOne(() => User)
	@JoinColumn()
	user2: User;

	@Column()
	type: number;
}

