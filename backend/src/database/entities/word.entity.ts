import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  text: string;

  @Column({ type: 'int' })
  type: number; // 0: whitelist, 1: blacklist
}
