import { CashBalance } from '../models/CashBalanceModel';
import { EmployeeSalary } from '../models/EmployeeSalaryModel';
import { FinancialMovement } from '../models/FinancialMovementModel';

export type Resolver = {
  Query: {
    cashBalance: () => Promise<CashBalance | null>;
    salaries: () => Promise<EmployeeSalary[]>;
    movements: () => Promise<FinancialMovement[]>;
  };
  Mutation: {
    updateCashBalance: (
      parent: any, 
      args: { cashBox: number; bankBalance: number }
    ) => Promise<CashBalance>;
    
    createSalary: (
      parent: any, 
      args: { name: string; amount: number; due: string; paid: boolean }
    ) => Promise<EmployeeSalary>;
    
    updateSalary: (
      parent: any, 
      args: { id: number } & Partial<{ name: string; amount: number; due: string; paid: boolean }>
    ) => Promise<EmployeeSalary>;
    
    deleteSalary: (
      parent: any, 
      args: { id: number }
    ) => Promise<boolean>;
    
    createMovement: (
      parent: any, 
      args: { type: string; amount: number; date: string; note?: string }
    ) => Promise<FinancialMovement>;
    
    updateMovement: (
      parent: any, 
      args: { id: number } & Partial<{ type: string; amount: number; date: string; note?: string }>
    ) => Promise<FinancialMovement>;
    
    deleteMovement: (
      parent: any, 
      args: { id: number }
    ) => Promise<boolean>;
  };
};

export type ResolverTypeWrapper<T> = Promise<T> | T;