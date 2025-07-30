import ProjectService from "../../services/projectService";

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

interface UpdateProjectInput {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  teamMemberIds?: string[];
}

export const projectResolvers = {

  Query: {
    projects: async () => {
      return ProjectService.getProjects();
    },
    project: async (_: any, { id }: { id: string }) => {
      return ProjectService.getProject(id);
    },

    getProjectTeamMembers: async (_: any, { projectId }: { projectId: string }) => {
      return ProjectService.getProjectTeamMembers(projectId);
    },
    // Get ALL team members with teamName across all projects
    getAllProjectTeamMembers: async () => {
      return ProjectService.getAllProjectTeamMembers();
    },

  },

  Mutation: {
    createProject: async (_ : any,  {project}  : { project : ProjectInput}) => {
      return ProjectService.createProject(project);
    },

    addUserToProject: async (_: any, { addUserToProject }: { addUserToProject: addUserToProjectArgs }) => {
      return ProjectService.addUserToProject(addUserToProject);
    },

    // Update project
    // Note: The userId is not updated in the database, as it is not part of the update
      updateProject: async (_: any, { project }: { project: UpdateProjectInput }) => {
        const { id, userId, ...updateData } = project;
        const projectInput: ProjectInput & { id: string } = {
          id,
          userId,
          title: updateData.title || "",
          status: updateData.status || "",
          description: updateData.description,
          startDate: updateData.startDate,
          endDate: updateData.endDate,
          color: updateData.color,
          teamMemberIds: updateData.teamMemberIds || [],
        };
        return ProjectService.updateProject(projectInput);

      },

   
    deleteProject: async (_: any, { inputDelete }: { inputDelete: { id: string; userId: string } }) => {
      return ProjectService.deleteProject(inputDelete);
    },
    

  },
};
