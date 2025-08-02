import { ExpenseService } from '../../services/expenseService';

export const expenseResolvers = {
  Query: {
    expenses: async (_: any, { filter }: { filter: any }) => {
      return ExpenseService.getExpenses(filter);
    }
  },
  Mutation: {
    createExpense: async (_: any, { input }: { input: any }) => {
      return ExpenseService.createExpense(input);
    }
  }
};