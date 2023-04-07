import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Game
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, {eager: true})
	@JoinColumn()
	user1: User;

    @Column()
    score1: number;

	@ManyToOne(() => User, {eager: true})
	@JoinColumn()
	user2: User;

    @Column()
    score2: number;

	@Column()
	type: number;
}