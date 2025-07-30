import { gql } from "apollo-server-express";

export const announcementTypeDefs = gql`
  type Announcement {
    id: ID!
    title: String!
    content: String!
    senderId: ID!
    sender: User
    visibility: String!
    visibleTo: [ID]
    createdAt: String
  }

  input AnnouncementInput {
    title: String!
    content: String!
    senderId: ID!
    visibility: String!
    visibleTo: [ID]
  }

  type Query {
    announcements: [Announcement!]!
  }

  type Mutation {
    createAnnouncement(input: AnnouncementInput!): Announcement!
  }
`;
