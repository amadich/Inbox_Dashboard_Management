import { FinancialMovement, MovementType } from '../models/FinancialMovementModel';

export class MovementService {
  static async getMovements(): Promise<FinancialMovement[]> {
    return FinancialMovement.findAll();
  }

  static async createMovement(data: {
    type: MovementType;
    amount: number;
    date: string;
    note?: string;
  }): Promise<FinancialMovement> {
    return FinancialMovement.create(data);
  }

  static async updateMovement(
    id: number, 
    data: Partial<{
      type?: MovementType;
      amount?: number;
      date?: string;
      note?: string;
    }>
  ): Promise<FinancialMovement> {
    const movement = await FinancialMovement.findByPk(id);
    if (!movement) throw new Error('Movement not found');
    return movement.update(data);
  }

  static async deleteMovement(id: number): Promise<void> {
    const movement = await FinancialMovement.findByPk(id);
    if (!movement) throw new Error('Movement not found');
    await movement.destroy();
  }
}