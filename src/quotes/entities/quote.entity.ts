import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  value: number;

  @ManyToOne(() => User, (user) => user.quotes, { eager: true, onDelete: 'CASCADE'  })
  @JoinColumn({ name: 'userId' })
  user: User;
}