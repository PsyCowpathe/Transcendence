import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from '../user/user.entity';

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => User, (user) => user.id, {eager: true, onDelete: 'CASCADE' })
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

	@ManyToOne(() => Channel, { onDelete: 'CASCADE' })
	channel: Channel

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;
}

@Entity()
export class Bans
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, { onDelete: 'CASCADE'})
	channel: Channel

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
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

	@ManyToOne(() => Channel, { onDelete: 'CASCADE' })
	channel: Channel

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
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
	channel: Channel

	@ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
	user: User;
}

@Entity()
export class InviteList
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, { onDelete: 'CASCADE', eager: true })
	channel: Channel

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;
}

@Entity()
export class Message
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Channel, (channel) => channel.id, { onDelete: 'CASCADE' })
	channel: Channel

	@ManyToOne(() => User, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
	sender: User;

	@Column()
	message: string;
}

@Entity()
export class Private
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
	user1: User;

	@ManyToOne(() => User, (user) => user.id, {eager: true, onDelete: 'CASCADE'})
	user2: User;

	@Column()
	message: string;
}
