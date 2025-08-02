import { EmployeeSalary } from '../models/EmployeeSalaryModel';

export class SalaryService {
  static async getSalaries() {
    return EmployeeSalary.findAll();
  }

  static async createSalary(data: {
    name: string;
    amount: number;
    due: string;
    paid: boolean;
  }) {
    return EmployeeSalary.create(data);
  }

  static async updateSalary(id: number, data: Partial<EmployeeSalary>) {
    const salary = await EmployeeSalary.findByPk(id);
    if (!salary) throw new Error('Salary not found');
    return salary.update(data);
  }

  static async deleteSalary(id: number) {
    const salary = await EmployeeSalary.findByPk(id);
    if (!salary) throw new Error('Salary not found');
    return salary.destroy();
  }
}