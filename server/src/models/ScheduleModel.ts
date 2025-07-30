import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

export enum ScheduleDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

@Table({
  tableName: "Schedules",
  timestamps: true,
})
export default class Schedule extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ScheduleDay)),
    allowNull: false,
    defaultValue: ScheduleDay.MONDAY,
  })
  day!: ScheduleDay;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "blue",
  })
  cardColor!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId!: string;
}