import { gql } from 'apollo-server-express';

export const revenueTypeDefs = gql`
  type Revenue {
    id: ID!
    amount: Float!
    source: String!
    date: String!
    project: String
    category: String
  }

  input RevenueInput {
    amount: Float!
    source: String!
    date: String!
    project: String
    category: String
  }

  input RevenueUpdateInput {
    amount: Float
    source: String
    date: String
    project: String
    category: String
  }

  input RevenueFilter {
    date: String
    project: String
    category: String
  }

  type Query {
    revenues(filter: RevenueFilter): [Revenue!]!
  }

  type Mutation {
    createRevenue(input: RevenueInput!): Revenue!
    updateRevenue(id: ID!, input: RevenueUpdateInput!): Revenue!
    deleteRevenue(id: ID!): Boolean!
  }
`;