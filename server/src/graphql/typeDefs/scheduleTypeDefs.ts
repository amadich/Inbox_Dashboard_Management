import { gql } from "apollo-server-express";

export const scheduleTypeDefs = gql`
  enum ScheduleDay {
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
    SUNDAY
  }

  type Schedule {
    id: ID!
    title: String!
    description: String
    day: ScheduleDay!
    cardColor: String!
    projectId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input ScheduleInput {
    title: String!
    description: String
    day: ScheduleDay!
    cardColor: String!
    projectId: ID!
  }

  type Query {
    schedulesByProjectId(projectId: ID!): [Schedule!]!
    schedule(id: ID!): Schedule
  }

  type Mutation {
    createSchedule(schedule: ScheduleInput!): Schedule!
    updateSchedule(id: ID!, schedule: ScheduleInput!): Schedule!
    updateScheduleDay(schedule: ScheduleDayUpdateInput!): Schedule!
    deleteSchedule(id: ID!): String!
  }

  input ScheduleDayUpdateInput {
    id: ID!
    day: ScheduleDay!
  }
`;