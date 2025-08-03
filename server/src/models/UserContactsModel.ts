import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'user_contacts' })
export class UserContact extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'C'
  })
  priority!: 'A+' | 'A' | 'B' | 'C';

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  state!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  zip!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes?: string;
}

export default UserContact;