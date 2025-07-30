import { gql } from "apollo-server-express";

export const projectTypeDefs = gql`

  enum ProjectStatus {
    ACTIVE
    COMPLETED
    ON_HOLD
  }

 type Project {
  id: ID!
  userId: ID!
  title: String!
  description: String
  status: ProjectStatus!
  startDate: String
  endDate: String
  color: String!
  teamMembers: [User!]!
  tasks: [Task!]!
  createdAt: String!
  updatedAt: String!
  }

  input ProjectInput {
    userId: ID!
    title: String!
    description: String
    status: ProjectStatus!
    startDate: String
    endDate: String
    color: String
    teamMemberIds: [ID!]!
  }

  input UpdateProjectInput {
    id: ID!
    userId: ID!
    title: String
    description: String
    status: ProjectStatus
    startDate: String
    endDate: String
    color: String
    teamMemberIds: [ID!]
  }

  input addUserToProjectArgs {
    projectId: ID!
    userId: ID!
    teamName: String!
  }

  type ProjectTeamMembers {
    projectId: ID!
    userId: ID!
    teamName: String!
    project: Project
    user: User
  }

  type Query {
    projects: [Project!]!
    project(id: ID!): Project
    getAllProjectTeamMembers: [ProjectTeamMembers!]!
    getProjectTeamMembers(projectId: ID!): [ProjectTeamMembers!]!
  }

  input ProjectInputDelete {
    id: ID!
    userId: ID!
  }

  type Mutation {
    createProject(project: ProjectInput!): Project!
    addUserToProject(addUserToProject: addUserToProjectArgs!): Project!
    updateProject(project: UpdateProjectInput!): Project!
    deleteProject(inputDelete : ProjectInputDelete!): Project
  }
`;
