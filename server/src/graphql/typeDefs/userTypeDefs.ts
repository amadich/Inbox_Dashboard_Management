import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  enum UserRole {
    ADMIN
    MANAGER
    CLIENT
    TEAM
    GUEST
  }

  enum UserStatus {
    FullTime
    PartTime
    Intern
    Freelancer
  }

  type User {
    id: ID!
    userId: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    status: UserStatus!
    birthDate: String
    role: UserRole!
  }

  input UserInput {
    userId: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phoneNumber: String
    status: UserStatus
    birthDate: String
    role: UserRole
  }

  input UpdateUserInput {
  id: ID!
  userId: ID!
  firstName: String
  lastName: String
  email: String
  password: String
  phoneNumber: String
  status: UserStatus
  birthDate: String
  role: UserRole
}

  input UserLogin {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  input UserInputDelete {
    id: ID!
    userId: ID!
  }

  type Mutation {
    createUser(user: UserInput!): AuthPayload!
    login(user: UserLogin!): AuthPayload!
    deleteUser(inputDelete: UserInputDelete!): User
    verifyToken(token: String!): AuthPayload
    updateUser(inputUpdate: UpdateUserInput!): User
  }
`;
