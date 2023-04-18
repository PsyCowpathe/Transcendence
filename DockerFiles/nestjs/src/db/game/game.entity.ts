import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class MatchHistory
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, {eager: true, onDelete : 'CASCADE'})
	@JoinColumn()
	user1: User;

    @Column()
    score1: number;

	@ManyToOne(() => User, {eager: true, onDelete : 'CASCADE'})
	@JoinColumn()
	user2: User;

    @Column()
    score2: number;
}

@Entity()
export class MatchMaking
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, {eager: true, onDelete : 'CASCADE'})
	@JoinColumn()
	user: User;
}
