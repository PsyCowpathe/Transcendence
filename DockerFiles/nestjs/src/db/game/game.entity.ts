import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class MatchHistory
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, {eager: true, onDelete : 'CASCADE'})
	user1: User;

    @Column()
    score1: number;

	@ManyToOne(() => User, {eager: true, onDelete : 'CASCADE'})
	user2: User;

    @Column()
    score2: number;
}
