import { Exclude } from 'class-transformer';
import { AfterInsert, Entity, Column, PrimaryGeneratedColumn, AfterUpdate, AfterRemove } from 'typeorm';

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

  @AfterInsert()
  logInsert() {
    console.log('Inserted data user with id ' + this.id)
  }

  @AfterUpdate() 
  logUpdate() {
    console.log('Updated data user with id ' + this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed data user with id ' + this.id)
  }
}
