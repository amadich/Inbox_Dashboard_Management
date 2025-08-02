import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'cash_balances' })
export class CashBalance extends Model {
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  })
  cashBox!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  })
  bankBalance!: number;

  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default CashBalance;