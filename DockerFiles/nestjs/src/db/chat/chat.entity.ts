import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from '../user/user.entity';

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToOne(() => User)
	owner: User;

	@Column()
	visibility: string;

	@Column()
	password: string;
}

@Entity()
export class Admins
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel)
	@JoinColumn()
	channel: Channel

	@OneToOne(() => User)
	@JoinColumn()
	user: User;
}

@Entity()
export class Bans
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel)
	@JoinColumn()
	channel: Channel

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@Column()
	time: number;
}

@Entity()
export class Mutes
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel)
	@JoinColumn()
	channel: Channel

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@Column()
	time: number;
}

@Entity()
export class JoinChannel
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel)
	@JoinColumn()
	channel: Channel

	@OneToOne(() => User)
	@JoinColumn()
	user: User;
}

@Entity()
export class InviteList
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel)
	@JoinColumn()
	channel: Channel

	@OneToOne(() => User)
	@JoinColumn()
	user: User;
}
