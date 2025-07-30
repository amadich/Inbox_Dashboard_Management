import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default } from "sequelize-typescript";
import User from "./userModel";

export enum ActionType {
  LOGIN = "LOGIN",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ADD_TEAM_MEMBER = "ADD_TEAM_MEMBER",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER" 
}

export enum EntityType {
  USER = "USER",
  PROJECT = "PROJECT",
}

@Table({
  tableName: 'Activities',
  timestamps: true,
})
export default class Activity extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  // Add this association
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    targetKey: 'id'
  })
  user!: User;

  @Column({
    type: DataType.ENUM(...Object.values(ActionType)),
    allowNull: false,
  })
  actionType!: ActionType;

  @Column({
    type: DataType.ENUM(...Object.values(EntityType)),
    allowNull: false,
  })
  entityType!: EntityType;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  entityId!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  details?: object;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp!: Date;

  
}