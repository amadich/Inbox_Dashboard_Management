import { CashService } from '../../services/cashService';
import { SalaryService } from '../../services/salaryService';
import { MovementService } from '../../services/movementService';
import { MovementType } from '../../models/FinancialMovementModel';
import { EmployeeSalary } from '../../models/EmployeeSalaryModel';

// Define TypeScript interfaces
interface CashBalanceArgs {
  cashBox: number;
  bankBalance: number;
}

interface CreateSalaryArgs {
  name: string;
  amount: number;
  due: string;
  paid: boolean;
}

interface UpdateSalaryArgs {
  id: number;
  name?: string;
  amount?: number;
  due?: string;
  paid?: boolean;
}

interface CreateMovementArgs {
  type: string;
  amount: number;
  date: string;
  note?: string;
}

interface UpdateMovementArgs {
  id: number;
  type?: string;
  amount?: number;
  date?: string;
  note?: string;
}

// Translation maps for MovementType
const movementTypeToEnglish: Record<string, MovementType> = {
  'إيداع': MovementType.DEPOSIT,
  'سحب': MovementType.WITHDRAWAL,
  'تحويل': MovementType.TRANSFER
};

const movementTypeToArabic: Record<MovementType, string> = {
  [MovementType.DEPOSIT]: 'إيداع',
  [MovementType.WITHDRAWAL]: 'سحب',
  [MovementType.TRANSFER]: 'تحويل'
};

// Resolver implementation
export const payrollResolvers = {
  Query: {
    cashBalance: async () => CashService.getCashBalance(),
    salaries: async () => SalaryService.getSalaries(),
    movements: async () => {
      const movements = await MovementService.getMovements();
      return movements.map(movement => ({
        ...movement,
        type: movementTypeToArabic[movement.type] || movement.type
      }));
    }
  },
  Mutation: {
    updateCashBalance: async (_: any, { cashBox, bankBalance }: CashBalanceArgs) => 
      CashService.updateCashBalance(cashBox, bankBalance),
    
    createSalary: async (_: any, args: CreateSalaryArgs) => {
        // Pass due as string
        return SalaryService.createSalary({
          ...args,
          due: args.due
        });
      },

    updateSalary: async (_: any, { id, ...data }: UpdateSalaryArgs) => {
        // Convert due string to Date object if it exists
        const updateData: Partial<EmployeeSalary> = { 
          ...data,
          due: data.due ? new Date(data.due) : undefined
        };
        
        return SalaryService.updateSalary(id, updateData);
      },

    deleteSalary: async (_: any, { id }: { id: number }) => {
      await SalaryService.deleteSalary(id);
      return true;
    },
    
    createMovement: async (_: any, args: CreateMovementArgs) => {
      console.log('Received createMovement request:', args);
      try {
        const englishType = movementTypeToEnglish[args.type];
        if (!englishType) {
          throw new Error(`Invalid movement type: ${args.type}`);
        }
        
        const result = await MovementService.createMovement({
          ...args,
          type: englishType
        });
        
        console.log('Movement created:', result);
        return result;
      } catch (error) {
        console.error('Error in createMovement:', error);
        throw error;
      }
    },
    
    updateMovement: async (_: any, { id, type, ...data }: UpdateMovementArgs) => {
      const updateData: any = { ...data };
      
      if (type) {
        const englishType = movementTypeToEnglish[type];
        if (!englishType) {
          throw new Error(`Invalid movement type: ${type}`);
        }
        updateData.type = englishType;
      }
      
      return MovementService.updateMovement(id, updateData);
    },
    
    deleteMovement: async (_: any, { id }: { id: number }) => {
      await MovementService.deleteMovement(id);
      return true;
    }
  }
};