import { gql } from "apollo-server-express";

export const userContactTypeDefs = gql`
  type UserContact {
    id: ID!
    priority: String!
    fullName: String!
    phone: String!
    address: String!
    city: String!
    state: String!
    zip: String!
    notes: String
  }

  input CreateUserContactInput {
    priority: String!
    fullName: String!
    phone: String!
    address: String!
    city: String!
    state: String!
    zip: String!
    notes: String
  }

  input UpdateUserContactInput {
    priority: String
    fullName: String
    phone: String
    address: String
    city: String
    state: String
    zip: String
    notes: String
  }

  type Query {
    getAllContacts: [UserContact!]!
    getContactById(id: ID!): UserContact
    getContactsByPriority(priority: String!): [UserContact!]!  # Changed to String
  }

  type Mutation {
    createContact(input: CreateUserContactInput!): UserContact!
    updateContact(id: ID!, input: UpdateUserContactInput!): UserContact!
    deleteContact(id: ID!): Boolean!
  }
`;