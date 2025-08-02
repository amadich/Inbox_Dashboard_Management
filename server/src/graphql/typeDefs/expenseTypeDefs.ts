import { gql } from 'apollo-server-express';

export const expenseTypeDefs = gql`
  type Expense {
    id: ID!
    amount: Float!
    description: String!
    date: String!
    project: String
    mainCategory: String!
    subCategory: String
  }

  input ExpenseInput {
    amount: Float!
    description: String!
    date: String!
    project: String
    mainCategory: String!
    subCategory: String
  }

  input ExpenseFilter {
    date: String
    project: String
    mainCategory: String
  }

  type Query {
    expenses(filter: ExpenseFilter): [Expense!]!
  }

  type Mutation {
    createExpense(input: ExpenseInput!): Expense!
  }
`;