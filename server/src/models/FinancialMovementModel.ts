import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum MovementType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER'
}

@Table({ tableName: 'financial_movements' })
export class FinancialMovement extends Model {
  @Column({
    type: DataType.ENUM(...Object.values(MovementType)),
    allowNull: false
  })
  type!: MovementType;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: Date;

  @Column(DataType.TEXT)
  note?: string;
}

export default FinancialMovement;