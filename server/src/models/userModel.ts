import { Table, Column, Model, DataType, Default, Unique, BelongsToMany, HasMany } from "sequelize-typescript";
import Project from "./projectModel";
import ProjectTeamMembers from "./ProjectTeamMembers";
import Activity from "./activityModel";

// Define an enum to represent the various user roles
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CLIENT = "CLIENT",
  TEAM = "TEAM",
  GUEST = "GUEST",
}

export enum UserStatus {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Intern = "Intern",
  Freelancer = "Freelancer",
}


@Table({
  tableName: 'Userstry',
  timestamps: true,
})
export default class User extends Model {
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
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string; // Store a hashed password for security

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    allowNull: true,
  })
  status?: UserStatus;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    defaultValue: new Date('2000-01-01'),
  })
  birthDate?: Date;

  // Role field to distinguish user types (supports use cases like Manage Users)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.CLIENT,
  })
  role!: UserRole;

  // Optional field to track user activity (e.g. last active time)
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastActiveAt?: Date;

   // ✅ Define many-to-many relationship with projects (team assignments)
   @BelongsToMany(() => Project, () => ProjectTeamMembers)
   projects!: Project[];

   // Add this association
  @HasMany(() => Activity)
  activities!: Activity[];

}
