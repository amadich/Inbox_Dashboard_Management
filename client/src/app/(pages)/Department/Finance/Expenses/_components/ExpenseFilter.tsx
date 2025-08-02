import { FunnelIcon } from "@heroicons/react/24/outline";

export function ExpenseFilter({ filters, onFilterChange }: { filters: any; onFilterChange: (filters: any) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="card bg-base-100 shadow-sm p-4 space-y-2">
      <h2 className="font-semibold flex items-center gap-2">
        <FunnelIcon className="w-5 h-5 text-primary" /> التصفية
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="date" type="date" className="input input-bordered" value={filters.date} onChange={handleChange} />
        <input name="project" placeholder="اسم المشروع" className="input input-bordered" value={filters.project} onChange={handleChange} />
        <select name="mainCategory" className="select select-bordered" value={filters.mainCategory} onChange={handleChange}>
          <option value="">كل التصنيفات</option>
          <option value="رواتب">رواتب</option>
          <option value="تشغيلية">تشغيلية</option>
          <option value="استثمارية">استثمارية</option>
          <option value="أخرى">أخرى</option>
        </select>
      </div>
    </div>
  );
}
