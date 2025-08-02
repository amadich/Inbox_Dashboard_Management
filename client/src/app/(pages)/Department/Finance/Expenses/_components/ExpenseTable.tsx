import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client/core';
import LoadingShow from "@/components/LoadingShow";
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

type Expense = {
  id: number;
  amount: number;
  description: string;
  date: string;
  project?: string;
  mainCategory: string;
  subCategory?: string;
};

export function ExpenseTable({ filters }: { filters: any }) {
  // Clean filters before sending
  const cleanedFilters = {
    date: filters.date || null,
    project: filters.project || null,
    mainCategory: filters.mainCategory || null
  };

  const { loading, error, data } = useQuery(GET_EXPENSES, {
    variables: { filter: cleanedFilters },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <LoadingShow msg="جاري التحميل..." />;
  
  if (error) {
    console.error("GraphQL Error Details:", {
      message: error.message,
      networkError: error.networkError,
      graphQLErrors: error.graphQLErrors
    });
    
    return (
      <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded">
        <strong>خطأ في تحميل البيانات:</strong>
        <p>{error.message}</p>
        {error.graphQLErrors?.map((err, i) => (
          <div key={i}>
            <p>تفاصيل الخطأ: {err.message}</p>
            {err.extensions && (
              <pre className="text-xs mt-2">
                {JSON.stringify(err.extensions, null, 2)}
              </pre>
            )}
          </div>
        ))}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
