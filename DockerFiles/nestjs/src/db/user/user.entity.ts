import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Socket } from 'socket.io';

@Entity()
export class User
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column()
	uid: number;

	@Column()
	name: string;

	@Column()
	registered: boolean;

	@Column({ nullable: true })
	TwoFASecret: string;

	@Column()
	TwoFA: boolean;

	@Column({ nullable: true })
	TwoFAToken: string;

	@Column({ nullable: true })
	TwoFAExpire: string

	@Column()
	Status: string
	
	@Column()
	Match: number

	@Column()
	Victory: number

	@Column()
	Defeat: number
}
