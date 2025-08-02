import {
  BanknotesIcon,
  ArrowDownIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

type Summary = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
};

export function ProfitLossSummary({ summary }: { summary?: Summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="stat from-green-400 to-green-600 bg-green-100 shadow border-2 border-green-500 rounded-lg">
        <div className="stat-figure text-success">
          <BanknotesIcon className="w-6 h-6" />
        </div>
        <div className="stat-title">إجمالي الإيرادات</div>
        <div className="stat-value text-success">
          {summary.totalRevenue.toLocaleString()} د.ع
        </div>
      </div>

      <div className="stat from-red-400 to-red-600 bg-red-100 shadow border-2 border-red-500 rounded-lg">
        <div className="stat-figure text-error">
          <ArrowDownIcon className="w-6 h-6" />
        </div>
        <div className="stat-title">إجمالي المصروفات</div>
        <div className="stat-value text-error">
          {summary.totalExpenses.toLocaleString()} د.ع
        </div>
      </div>

      <div className={`stat from-blue-400 to-blue-600 bg-blue-100 shadow border-2 border-blue-500 rounded-lg`}>
        <div className="stat-figure text-blue-500">
          <CalculatorIcon className="w-6 h-6" />
        </div>
        <div className="stat-title">صافي الربح</div>
        <div className={`stat-value ${summary.netProfit >= 0 ? 'text-blue-500' : 'text-error'}`}>
          {summary.netProfit.toLocaleString()} د.ع
        </div>
      </div>
    </div>
  );
}