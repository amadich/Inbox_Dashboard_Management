import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client/core';
import LoadingShow from "@/components/LoadingShow";
import Swal from "sweetalert2";

import {
  CalendarIcon,
  BanknotesIcon,
  BriefcaseIcon,
  FolderIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const GET_EXPENSES = gql`
  query GetExpenses($filter: ExpenseFilter) {
    expenses(filter: $filter) {
      id
      amount
      description
      date
      project
      mainCategory
      subCategory
    }
  }
`;

// New delete mutation
const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`;

export type Expense = {
  id: string;
  amount: number;
  description: string;
  date: string;
  project?: string;
  mainCategory: string;
  subCategory?: string;
};

export function ExpenseTable({ 
  filters, 
  setEditingExpense 
}: { 
  filters: any; 
  setEditingExpense: (expense: Expense) => void;
}) {
  const cleanedFilters = {
    date: filters.date || null,
    project: filters.project || null,
    mainCategory: filters.mainCategory || null
  };

  const { loading, error, data, refetch } = useQuery(GET_EXPENSES, {
    variables: { filter: cleanedFilters },
    fetchPolicy: 'cache-and-network',
  });

  // New delete mutation hook
  const [deleteExpense] = useMutation(DELETE_EXPENSE);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن هذا الإجراء!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        await deleteExpense({ variables: { id } });
        await Swal.fire('تم الحذف!', 'تم حذف المصروف بنجاح.', 'success');
        refetch(); // Refresh data after deletion
      } catch (err) {
        console.error('Error deleting expense:', err);
        await Swal.fire('خطأ!', 'حدث خطأ أثناء حذف المصروف.', 'error');
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

  if (!data?.expenses || data.expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد مصروفات لعرضها
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
            <th><BriefcaseIcon className="w-5 h-5 inline-block mr-1" /> الوصف</th>
            <th><FolderIcon className="w-5 h-5 inline-block mr-1" /> المشروع</th>
            <th><TagIcon className="w-5 h-5 inline-block mr-1" /> التصنيف الرئيسي</th>
            <th><TagIcon className="w-5 h-5 inline-block mr-1" /> التصنيف الفرعي</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.expenses.map((item: Expense) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.amount}</td>
              <td>{item.description}</td>
              <td>{item.project || '-'}</td>
              <td>{item.mainCategory}</td>
              <td>{item.subCategory || '-'}</td>
              <td className="flex gap-2">
                <button 
                  onClick={() => setEditingExpense(item)} 
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