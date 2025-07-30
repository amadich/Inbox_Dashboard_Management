import { gql } from "graphql-tag";

export const CREATE_PROJECT = gql`
  mutation CreateProject($project: ProjectInput!) {
    createProject(project: $project) {
      id
      title
      status
    }
  }
`;

export const ADD_USER_TO_PROJECT = gql`
  mutation addMembertoTeam($addUserToProject: addUserToProjectArgs!) {
    addUserToProject(addUserToProject: $addUserToProject) {
      id
      title
      teamMembers {
        id
        email
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
      status
      color
      startDate
      endDate
      teamMembers {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query getProjectById($projectId: ID!) {
     project(id: $projectId) {
      id
      userId
      title
      description
      status
      color
      startDate
      endDate
      teamMembers {
        id
        firstName
        lastName
        email
        role
        status
        birthDate
      }
    }
  }
`;
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      id
      title
      startDate
      endDate
      color
      status
    }
  }
  `;

export const GET_PROJECT_Title = gql`
  
    query getProjectById($projectId: ID!) {
     
      project(id: $projectId) {
        id
        title
      }

  }

`;

export const GET_PROJECT_ID = gql`
  
    query getProjectById($projectId: ID!) {
     
      project(id: $projectId) {
        id
        title
        teamMembers {
          id
          firstName
          lastName
          email
        }

      }
  }

`;

export const GET_FOR_PROFILE_PROJECTS = gql`
  query GetForProfileProjects {
    projects {
      id
      title
      description
      status
      color
      startDate
      endDate
      teamMembers {
        id
        firstName
        lastName
        email
        role
        status
        birthDate
      }
    }
  }
`;

export const GET_Users_PROJECTById = gql`

    query getUsersProjectbyId($projectId: ID!) {
      project(id: $projectId) {
        title
        teamMembers {
          id
          email
          firstName
          lastName
        }
      }
    }
`;

export const GET_USERS = gql`
  query GetUsers {
   users {
      id
      firstName
      lastName
      email
      phoneNumber
      role
   }
  }
`;

export const DELETE_PROJECT = gql`
  mutation deleteProject($inputDelete: ProjectInputDelete!) {
  deleteProject(inputDelete: $inputDelete) {
    id
    title
  }
}
`;


export const GET_ALL_PROJECT_TEAM_MEMBERS = gql`
  query GetAllProjectTeamMember {
    getAllProjectTeamMembers {
      projectId
      userId
      teamName
      user {
        firstName
        lastName
      }
      project {
        title
        status
      }
    }
  }
`;
