import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'employee_salaries' })
export class EmployeeSalary extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  due!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  paid!: boolean;
}

export default EmployeeSalary;
