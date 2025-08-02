import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client/core';
import LoadingShow from "@/components/LoadingShow";
import {
  CalendarIcon,
  BanknotesIcon,
  BriefcaseIcon,
  FolderIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Swal from "sweetalert2";

const GET_REVENUES = gql`
  query GetRevenues($filter: RevenueFilter) {
    revenues(filter: $filter) {
      id
      amount
      source
      date
      project
      category
    }
  }
`;

const DELETE_REVENUE = gql`
  mutation DeleteRevenue($id: ID!) {
    deleteRevenue(id: $id)
  }
`;

export function RevenueTable({ 
  filters, 
  setEditingRevenue 
}: { 
  filters: any; 
  setEditingRevenue: (revenue: any) => void;
}) {
  const cleanedFilters = {
    date: filters.date || null,
    project: filters.project || null,
    category: filters.category || null
  };

  const { loading, error, data, refetch } = useQuery(GET_REVENUES, {
    variables: { filter: cleanedFilters },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteRevenue] = useMutation(DELETE_REVENUE);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        await deleteRevenue({ variables: { id } });
        Swal.fire('تم الحذف!', 'تم حذف الإيراد بنجاح.', 'success');
        refetch();
      } catch (err) {
        console.error('Error deleting revenue:', err);
      }
    }
  };

  if (loading) return <LoadingShow msg="جاري التحميل..." />;
  
  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded">
        <strong>خطأ في تحميل البيانات:</strong>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data?.revenues || data.revenues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد إيرادات لعرضها
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th><CalendarIcon className="w-5 h-5 inline-block mr-1" /> التاريخ</th>
            <th><BanknotesIcon className="w-5 h-5 inline-block mr-1" /> المبلغ</th>
            <th><BriefcaseIcon className="w-5 h-5 inline-block mr-1" /> المصدر</th>
            <th><FolderIcon className="w-5 h-5 inline-block mr-1" /> المشروع</th>
            <th><TagIcon className="w-5 h-5 inline-block mr-1" /> التصنيف</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.revenues.map((item: any) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.amount}</td>
              <td>{item.source}</td>
              <td>{item.project || '-'}</td>
              <td>{item.category || '-'}</td>
              <td className="flex gap-2">
                <button 
                  onClick={() => setEditingRevenue(item)} 
                  className="btn btn-xs btn-info"
                >
                  تعديل
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="btn btn-xs btn-error"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}