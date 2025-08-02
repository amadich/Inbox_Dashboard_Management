import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'revenues' })
export class Revenue extends Model {
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
  source!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: Date;

  @Column(DataType.STRING)
  project!: string;

  @Column(DataType.STRING)
  category!: string;
}

export default Revenue;