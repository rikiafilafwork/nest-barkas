import { Exclude } from 'class-transformer';
import { Item } from '../items/item.entity';
import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted data user with id ' + this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated data user with id ' + this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed data user with id ' + this.id);
  }
}
