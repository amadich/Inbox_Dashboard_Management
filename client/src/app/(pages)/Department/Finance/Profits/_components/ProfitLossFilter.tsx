import { FunnelIcon } from '@heroicons/react/24/outline';

export function ProfitLossFilter({
  filters,
  onFilterChange,
}: {
  filters: any;
  onFilterChange: (filters: any) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ 
      ...filters, 
      [e.target.name]: e.target.value 
    });
  };

  return (
    <div className="card bg-base-100 shadow-sm p-4 space-y-2">
      <h2 className="flex items-center gap-2 font-semibold">
        <FunnelIcon className="w-5 h-5 text-primary" />
        التصفية
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="month"
          type="month"
          className="input input-bordered"
          value={filters.month}
          onChange={handleChange}
        />
        <input
          name="project"
          placeholder="اسم المشروع"
          className="input input-bordered border-none bg-blue-400 text-white placeholder:text-white outline-none shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          value={filters.project}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}