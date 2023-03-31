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

	@Column()
	TwoFASecret: string;

	@Column()
	TwoFA: boolean;
}
