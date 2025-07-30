import { gql } from "apollo-server-express";

export const activityTypeDefs = gql`
  scalar JSON

  enum ActionType {
    LOGIN
    CREATE
    UPDATE
    DELETE
    ADD_TEAM_MEMBER
    REMOVE_TEAM_MEMBER
  }

  enum EntityType {
    USER
    PROJECT
  }

  type Activity {
    id: ID!
    userId: ID!
    user: User
    actionType: ActionType!
    entityType: EntityType!
    entityId: ID!
    details: JSON
    timestamp: String!
  }

  type Query {
    activities: [Activity!]!
    activitiesByUser(userId: ID!): [Activity!]!
    activitiesByEntity(entityType: EntityType!, entityId: ID!): [Activity!]!
  }
`;