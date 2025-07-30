import Project from "../models/projectModel";
import User from "../models/userModel";
import ProjectTeamMembers from "../models/ProjectTeamMembers";
import { createActivity } from "./activityService";
import { ActionType, EntityType } from "../models/activityModel";
import { Op } from "sequelize";

interface ProjectInput {
  userId: string;
  title: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  teamMemberIds: string[];
}

interface addUserToProjectArgs {
   projectId: string;
   userId: string;
   teamName: string;
 }
 

export default class ProjectService {

  static async getProjects(): Promise<Project[]> {
    try {
      return await Project.findAll({
        include: [User],
      });
    } catch (error) {
      console.error("Error in getProjects:", error);
      throw new Error("Failed to get projects");
    }
  }

  static async getProject(id: string): Promise<Project | null> {
    try {
      return await Project.findByPk(id, {
        include: [User],
      });
    } catch (error) {
      console.error("Error in getProject:", error);
      throw new Error("Failed to get project");
    }
  }

  static async getProjectTeamMembers(projectId: string): Promise<ProjectTeamMembers[]> {
    try {
      return await ProjectTeamMembers.findAll({
        where: { projectId },
        include: [User],
      });
    } catch (error) {
      console.error("Error in getProjectTeamMembers:", error);
      throw new Error("Failed to get project team members");
    }
  }

  static async createProject({ userId,title, description, status , startDate, endDate , color, teamMemberIds }: ProjectInput): Promise<Project | null> {
    try {
      // Create the project without team members
      const newProject = await Project.create({
        userId,
        title,
        description,
        status,
        startDate,
        endDate,
        color,
      });

      // Add team members to the project
      if (teamMemberIds.length > 0) {
        await newProject.$set("teamMembers", teamMemberIds);
      }

      
      
      await createActivity({
        userId,
        actionType: ActionType.CREATE,
        entityType: EntityType.PROJECT,
        entityId: newProject.id,
        details: {
          title: newProject.title,
          status: newProject.status
        }
      });

      // Re-fetch the project including team members
      return await Project.findByPk(newProject.id, {
        include: [User],
      });
    } catch (error) {
      console.error("Error in createProject:", error);
      throw new Error("Failed to create project");
    }
  }

  // Add the following method to the ProjectService class
  // This method adds a user to a project's team

  static async addUserToProject({ projectId, userId, teamName }: addUserToProjectArgs): Promise<Project | null> {
    try {
      // Find the project
      const project = await Project.findByPk(projectId, {
        include: [User],
      });
      if (!project) {
        throw new Error("Project not found");
      }
  
      // Find the user
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
  
      // Add the user to the project's team with teamName
      await project.$add("teamMembers", user, { through: { teamName } });
  
      // Re-fetch project to return updated team members
      return await Project.findByPk(projectId, { include: [User] });
    } catch (error) {
      console.error("Error in addUserToProject:", error);
      throw new Error("Failed to add user to project");
    }
  }

  // Method to update a project
  // This method updates a project by its ID
  // It verifies the ownership of the project before updating
  // It also updates the team members if provided
  // It logs the activity of the update

  static async updateProject({ id, userId, ...updateData }: ProjectInput & { id: string }): Promise<Project | null> {
    try {
      const project = await Project.findByPk(id, {
        include: [User],
      });
  
      if (!project) {
        throw new Error("Project not found");
      }
  
      // Verify ownership
      if (project.userId !== userId) {
        throw new Error("Unauthorized: User is not the project owner");
      }
  
      // Extract team members if provided
      const { teamMemberIds, ...projectUpdate } = updateData;
  
      // Update project fields
      await project.update(projectUpdate);
  
      // Update team members if provided
      if (teamMemberIds !== undefined) {
        await project.$set("teamMembers", teamMemberIds);
      }
  
      // Log activity
      await createActivity({
        userId,
        actionType: ActionType.UPDATE,
        entityType: EntityType.PROJECT,
        entityId: id,
        details: {
          title: project.title,
          status: project.status
        }
      });
  
      return await Project.findByPk(id, {
        include: [User],
      });
    } catch (error) {
      console.error("Error in updateProject:", error);
      throw new Error("Failed to update project");
    }
  }
  
  // Method to delete a project
  // This method deletes a project by its ID
  static async deleteProject( {id , userId} :{ id: string; userId: string } ): Promise<Project | null> {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Project not found");
      }

      // Log before deletion
      await createActivity({
        userId : userId,
        actionType: ActionType.DELETE,
        entityType: EntityType.PROJECT,
        entityId: id,
        details: {
          projectTitle: project?.title,
          status: project?.status
        }
      });
      
      await project.destroy();
      return project;
    } catch (error) {
      console.error("Error in deleteProject:", error);
      throw new Error("Failed to delete project");
    }
  }


  // Get ALL entries with teamName (across all projects)
  static async getAllProjectTeamMembers(): Promise<ProjectTeamMembers[]> {
    try {
      return await ProjectTeamMembers.findAll({
        where: {
          teamName: {
            [Op.and]: [
              { [Op.ne]: "" },
              { [Op.ne]: null }
            ]
          }
        },
        include: [
          { model: User },
          { model: Project }
        ],
      });
    } catch (error) {
      console.error("Error getting all team members:", error);
      throw new Error("Failed to get all team members");
    }
  }
  

}
