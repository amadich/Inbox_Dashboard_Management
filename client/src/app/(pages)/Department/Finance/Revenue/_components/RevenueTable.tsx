import {
  CalendarIcon,
  BanknotesIcon,
  BriefcaseIcon,
  FolderIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client/core';
import LoadingShow from "@/components/LoadingShow";

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

type Props = {
  filters: any;
};

// const dummyData = [
//   { id: 1, amount: 1500, source: 'مبيعات', date: '2025-07-01', project: 'مشروع أ', category: 'تقنية' },
//   { id: 2, amount: 500, source: 'خدمة استشارية', date: '2025-07-02', project: 'مشروع ب', category: 'خدمات' },
// ];

export function RevenueTable({ filters }: Props) {
  // const filtered = dummyData.filter((item) =>
  //   (!filters.date || item.date === filters.date) &&
  //   (!filters.project || item.project.includes(filters.project)) &&
  //   (!filters.category || item.category.includes(filters.category))
  // );

    const { loading, error, data } = useQuery(GET_REVENUES, {
    variables: { filter: filters }
  });

  if (loading) return <LoadingShow msg='جاري التحميل...' />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th><CalendarIcon className="w-5 h-5 inline" /> التاريخ</th>
            <th><BanknotesIcon className="w-5 h-5 inline" /> المبلغ</th>
            <th><BriefcaseIcon className="w-5 h-5 inline" /> المصدر</th>
            <th><FolderIcon className="w-5 h-5 inline" /> المشروع</th>
            <th><TagIcon className="w-5 h-5 inline" /> الفئة</th>
          </tr>
        </thead>
        <tbody>
          {data.revenues.map((item: any) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.amount}</td>
              <td>{item.source}</td>
              <td>{item.project}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
