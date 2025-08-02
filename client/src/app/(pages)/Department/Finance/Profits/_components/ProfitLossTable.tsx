import { CalendarIcon, FolderIcon, TagIcon } from '@heroicons/react/24/outline';

type ProfitLossItem = {
  id: string;
  date: string;
  type: string;
  amount: number;
  category: string;
  project?: string;
  description: string;
};

export function ProfitLossTable({ data }: { data: ProfitLossItem[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد بيانات لعرضها
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th><CalendarIcon className="w-5 h-5 inline" /> التاريخ</th>
            <th>النوع</th>
            <th>المبلغ</th>
            <th><TagIcon className="w-5 h-5 inline" /> التصنيف</th>
            <th><FolderIcon className="w-5 h-5 inline" /> المشروع</th>
            <th>الوصف</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>
                <span className={`badge ${item.type === 'revenue' ? 'bg-green-300' : 'bg-red-300'}`}>
                  {item.type === 'revenue' ? 'إيراد' : 'مصروف'}
                </span>
              </td>
              <td>
                {item.type === 'revenue' ? '+' : '-'}
                {item.amount.toLocaleString()} د.ع
              </td>
              <td>{item.category}</td>
                <td className="flex items-center gap-2">
                  {item.project || '-'}
                  {item.project && (
                    <button
                      type="button"
                      className="ml-1 p-1 rounded hover:bg-gray-200"
                      title="نسخ إلى الحافظة"
                      onClick={() => {navigator.clipboard.writeText(item.project!); alert('تم نسخ اسم المشروع إلى الحافظة');}}
                    >
                      {/* Heroicons Clipboard Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8m4-4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      </svg>
                    </button>
                  )}
                </td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}