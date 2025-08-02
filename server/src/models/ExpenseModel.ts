import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'expenses' })
export class Expense extends Model {
  
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  description!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: Date;

  @Column(DataType.STRING)
  project?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  mainCategory!: string;

  @Column(DataType.STRING)
  subCategory?: string;
}

export default Expense;