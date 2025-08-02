import { gql } from 'apollo-server-express';

export const payrollTypeDefs = gql`
  type CashBalance {
    id: ID!
    cashBox: Float!
    bankBalance: Float!
    updatedAt: String!
  }

  type EmployeeSalary {
    id: ID!
    name: String!
    amount: Float!
    due: String!
    paid: Boolean!
    updatedAt: String!
  }

   enum MovementType {
    DEPOSIT
    WITHDRAWAL
    TRANSFER
  }

  type FinancialMovement {
    id: ID!
    type: MovementType!
    amount: Float!
    date: String!
    note: String
    updatedAt: String!
  }

  type Query {
    cashBalance: CashBalance
    salaries: [EmployeeSalary!]!
    movements: [FinancialMovement!]!
  }

  type Mutation {
    updateCashBalance(cashBox: Float!, bankBalance: Float!): CashBalance!
    createSalary(name: String!, amount: Float!, due: String!, paid: Boolean!): EmployeeSalary!
    updateSalary(id: ID!, name: String, amount: Float, due: String, paid: Boolean): EmployeeSalary!
    deleteSalary(id: ID!): Boolean!
    createMovement(type: MovementType!, amount: Float!, date: String!, note: String): FinancialMovement!
    updateMovement(id: ID!, type: MovementType, amount: Float, date: String, note: String): FinancialMovement!
    deleteMovement(id: ID!): Boolean!
  }
`;