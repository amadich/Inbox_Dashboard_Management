import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

// Enum for task statuses with uppercase values
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

// Enum for task priorities with uppercase values
export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

@Table({
  tableName: "Tasks",
  timestamps: true, // Adds createdAt and updatedAt
})
export default class Task extends Model {
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
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.TODO,
  })
  status!: TaskStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskPriority)),
    allowNull: false,
    defaultValue: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  })
  progress!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "blue",
  })
  cardColor!: string;

  // Foreign key to associate tasks with projects
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId!: string;

}
