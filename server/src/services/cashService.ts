import { CashBalance } from '../models/CashBalanceModel';

export class CashService {
  static async getCashBalance() {
    return CashBalance.findOne();
  }

  static async updateCashBalance(cashBox: number, bankBalance: number) {
    const [balance, created] = await CashBalance.findOrCreate({
      where: { id: 1 },
      defaults: { cashBox, bankBalance }
    });
    
    if (!created) {
      return balance.update({ cashBox, bankBalance });
    }
    
    return balance;
  }
}