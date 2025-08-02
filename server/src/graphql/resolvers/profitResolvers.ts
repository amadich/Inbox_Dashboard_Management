import { RevenueService } from '../../services/revenueService';
import { ExpenseService } from '../../services/expenseService';

export const profitResolvers = {
  Query: {
    profitLossData: async (_: any, { filter }: { filter: any }) => {
      const [revenues, expenses] = await Promise.all([
        RevenueService.getRevenues(filter),
        ExpenseService.getExpenses(filter)
      ]);

      return [
        ...revenues.map((r: any) => ({
          id: `rev_${r.id}`,
          date: r.date,
          type: 'revenue',
          amount: r.amount,
          category: r.source,
          project: r.project,
          description: `إيراد: ${r.source}`
        })),
        ...expenses.map((e: any) => ({
          id: `exp_${e.id}`,
          date: e.date,
          type: 'expense',
          amount: e.amount,
          category: e.mainCategory,
          project: e.project,
          description: e.description
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    profitLossSummary: async (_: any, { filter }: { filter: any }) => {
      const [revenues, expenses] = await Promise.all([
        RevenueService.getRevenues(filter),
        ExpenseService.getExpenses(filter)
      ]);

      const totalRevenue = revenues.reduce((sum: number, r: any) => sum + r.amount, 0);
      const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

      return {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses
      };
    }
    
  }
};