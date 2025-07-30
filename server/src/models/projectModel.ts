import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import User from "./userModel";
import Task from "./TaskModel";
import ProjectTeamMembers from "./ProjectTeamMembers"; // Import the join table

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}


@Table({
  tableName: "Projects",
  timestamps: true,
})
export default class Project extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
    defaultValue: ProjectStatus.ACTIVE,
  })
  status!: ProjectStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  startDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  endDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "#F5F5F5",
  })
  color!: string;

  @HasMany(() => Task, { foreignKey: "projectId" })
  tasks!: Task[];

  // ✅ Define many-to-many relationship with users (team members)
  @BelongsToMany(() => User, () => ProjectTeamMembers)
  teamMembers!: User[];
}
