import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from '../user/user.entity';

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => User, (user) => user.id, {eager: true})
	owner: User;

	@Column()
	visibility: string;

	@Column({nullable: true})
	password: string;
}

@Entity()
export class Admins
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Channel, {eager: true})
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

	@ManyToOne(() => Channel)
	@JoinColumn()
	channel: Channel

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@Column()
	end: string;

	@Column()
	reason: string;
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
	end: string;

	@Column()
	reason: string;
}

@Entity()
export class JoinChannel
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, (channel) => channel.id, { onDelete: 'CASCADE', eager: true })
	@JoinColumn()
	channel: Channel

	@ManyToOne(() => User, (user) => user.id)
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

@Entity()
export class Message
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, (channel) => channel.id, { onDelete: 'CASCADE' })
	@JoinColumn()
	channel: Channel

	@ManyToOne(() => User, (user) => user.id, {eager: true})
	sender: User;

	@Column()
	message: string;
}

@Entity()
export class Private
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.id, {eager: true})
	user1: User;

	@ManyToOne(() => User, (user) => user.id, {eager: true})
	user2: User;

	@Column()
	message: string;
}