import { FunnelIcon } from '@heroicons/react/24/outline';

type Props = {
  filters: any;
  onFilterChange: (filters: any) => void;
};

export function RevenueFilter({ filters, onFilterChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="card bg-base-100 shadow-sm p-4 space-y-2">
      <div className="flex items-center gap-2">
        <FunnelIcon className="w-5 h-5 text-primary" />
        <h2 className="font-semibold">التصفية</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="date" type="date" className="input input-bordered" value={filters.date} onChange={handleChange} />
        <input name="project" placeholder="اسم المشروع" className="input input-bordered" value={filters.project} onChange={handleChange} />
        <input name="category" placeholder="الفئة" className="input input-bordered" value={filters.category} onChange={handleChange} />
      </div>
    </div>
  );
}
