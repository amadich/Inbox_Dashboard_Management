import { gql } from 'apollo-server-express';

export const profitTypeDefs = gql`
  type ProfitLossItem {
    id: ID!
    date: String!
    type: String!  # "revenue" or "expense"
    amount: Float!
    category: String!
    project: String
    description: String
  }

  type ProfitLossSummary {
    totalRevenue: Float!
    totalExpenses: Float!
    netProfit: Float!
  }

  input ProfitLossFilter {
    month: String
    project: String
  }

  type Query {
    profitLossData(filter: ProfitLossFilter): [ProfitLossItem!]!
    profitLossSummary(filter: ProfitLossFilter): ProfitLossSummary!
  }
`;