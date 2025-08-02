import { Revenue } from '../models/RevenueModel';
import { Op } from 'sequelize';

interface RevenueFilter {
  date?: string;
  project?: string;
  category?: string;
}

export class RevenueService {
  static async createRevenue(data: {
    amount: number;
    source: string;
    date: string;
    project?: string;
    category?: string;
  }) {
    return Revenue.create(data);
  }

  static async getRevenues(filters: RevenueFilter = {}) {
    const where: any = {};
    
    if (filters.date) where.date = filters.date;
    if (filters.project) where.project = { [Op.iLike]: `%${filters.project}%` };
    if (filters.category) where.category = { [Op.iLike]: `%${filters.category}%` };

    return Revenue.findAll({ where });
  }

  // New update method
  static async updateRevenue(id: string, data: Partial<Revenue>) {
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      throw new Error('Revenue not found');
    }
    return revenue.update(data);
  }

  // New delete method
  static async deleteRevenue(id: string) {
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      throw new Error('Revenue not found');
    }
    await revenue.destroy();
    return true;
  }
}