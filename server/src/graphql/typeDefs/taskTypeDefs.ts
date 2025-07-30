import { gql } from "apollo-server-express";

export const taskTypeDefs = gql`
  enum TaskStatus {
    TODO
    IN_PROGRESS
    IN_REVIEW
    DONE
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    progress: Int!
    cardColor: String!
    projectId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input TaskInput {
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    progress: Int!
    cardColor: String!
    projectId: ID!
  }

  input UpdateTaskInput {
  title: String
  description: String
  status: TaskStatus
  priority: TaskPriority
  progress: Int
  cardColor: String
  projectId: ID
  }

  input TaskStatusUpdateInput {
     id: ID!
     status: TaskStatus!
  }

  type Query {
    tasks: [Task!]!
    tasksByProjectId(projectId: ID!): [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(task: TaskInput!): Task!
    updateTask(id: ID!, task: UpdateTaskInput!): Task!
    updateTaskStatus(task: TaskStatusUpdateInput!): Task!
    deleteTask(id: ID!): String!
  }
`;
