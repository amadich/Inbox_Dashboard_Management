import {
   Table,
   Column,
   Model,
   ForeignKey,
   BelongsTo,
 } from "sequelize-typescript";
 import Project from "./projectModel";
 import User from "./userModel";
 
 @Table({
   tableName: "ProjectTeamMembers",
   timestamps: false, // No need for createdAt/updatedAt for the join table
 })
 export default class ProjectTeamMembers extends Model {
   @ForeignKey(() => Project)
   @Column
   projectId!: string;
 
   @ForeignKey(() => User)
   @Column
   userId!: string;

   // Team name ( ex:design or development )
   @Column
   teamName!: string;
 
   @BelongsTo(() => Project)
   project!: Project;
 
   @BelongsTo(() => User)
   user!: User;
 }
 