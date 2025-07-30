import {
   Table,
   Column,
   Model,
   DataType,
   ForeignKey,
   BelongsTo,
 } from "sequelize-typescript";
 import User from "./userModel";
 
 @Table({
   tableName: "Announcements",
   timestamps: true,
 })
 export default class Announcement extends Model {
   @Column({
     type: DataType.UUID,
     defaultValue: DataType.UUIDV4,
     primaryKey: true,
   })
   id!: string;
 
   @Column(DataType.STRING)
   title!: string;
 
   @Column(DataType.TEXT)
   content!: string;
 
   @ForeignKey(() => User)
   @Column(DataType.UUID)
   senderId!: string;
 
   @BelongsTo(() => User)
   sender!: User;
 
   @Column({
     type: DataType.ENUM("all", "specific"),
     allowNull: false,
     defaultValue: "all",
   })
   visibility!: "all" | "specific";
 
   @Column({
     type: DataType.JSON,
     allowNull: true,
   })
   visibleTo?: string[]; // array of user IDs (UUIDs)
 }
 