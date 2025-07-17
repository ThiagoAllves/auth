import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Quote } from '../../quotes/entities/quote.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false }) // 👈 Adiciona esta linha
  isAdmin: boolean;

  @OneToMany(() => Quote, (quote) => quote.user)
  quotes: Quote[];
}