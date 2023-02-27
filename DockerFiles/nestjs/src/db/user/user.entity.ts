import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User
{
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	token: string

	@Column()
	uid: number

	@Column()
	name: string;

}
