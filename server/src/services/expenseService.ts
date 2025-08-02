import { Expense } from '../models/ExpenseModel';
import { Op } from 'sequelize';

interface ExpenseFilter {
  date?: string;
  project?: string;
  mainCategory?: string;
}

export class ExpenseService {
  static async createExpense(data: {
    amount: number;
    description: string;
    date: string;
    project?: string;
    mainCategory: string;
    subCategory?: string;
  }) {
    return Expense.create(data);
  }

  static async getExpenses(filters: ExpenseFilter = {}) {
    const where: any = {};
    
    if (filters.date) where.date = filters.date;
    if (filters.project) where.project = { [Op.iLike]: `%${filters.project}%` };
    if (filters.mainCategory) where.mainCategory = filters.mainCategory;

    return Expense.findAll({ where });
  }

   static async updateExpense(id: string, data: Partial<Expense>) {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense.update(data);
  }

  static async deleteExpense(id: string) {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    await expense.destroy();
    return true;
  }


}