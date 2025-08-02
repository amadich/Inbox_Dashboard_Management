'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { ProfitLossFilter } from './_components/ProfitLossFilter';
import { ProfitLossTable } from './_components/ProfitLossTable';
import { ProfitLossSummary } from './_components/ProfitLossSummary';
import inboxLogo from "@/assets/images/sotetel_logo.png";
import Image from 'next/image';
import LoadingShow from "@/components/LoadingShow";
import Snowflakes from "@/components/Snowflakes";

const GET_PROFIT_LOSS_DATA = gql`
  query GetProfitLossData($filter: ProfitLossFilter) {
    profitLossData(filter: $filter) {
      id
      date
      type
      amount
      category
      project
      description
    }
  }
`;

const GET_PROFIT_LOSS_SUMMARY = gql`
  query GetProfitLossSummary($filter: ProfitLossFilter) {
    profitLossSummary(filter: $filter) {
      totalRevenue
      totalExpenses
      netProfit
    }
  }
`;

export default function ProfitLossPage() {
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7), // Default to current month
    project: '',
  });

  const { data: summaryData, loading: summaryLoading } = useQuery(GET_PROFIT_LOSS_SUMMARY, {
    variables: { filter: filters }
  });

  const { data: tableData, loading: tableLoading } = useQuery(GET_PROFIT_LOSS_DATA, {
    variables: { filter: filters }
  });

  return (
    <>
        <Snowflakes />
        <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          <Image 
            src={inboxLogo} 
            alt="Sotetel Logo" 
            width={50} 
            height={50} 
            className="inline-block mr-2" 
          />
          بيان <span className='text-blue-500'>الأرباح والخسائر</span>
        </h1>
        
        <ProfitLossFilter filters={filters} onFilterChange={setFilters} />
        
        {summaryLoading ? (
          <LoadingShow msg="جاري حساب الأرباح..." />
        ) : (
          <ProfitLossSummary summary={summaryData?.profitLossSummary} />
        )}
        <p className='text-gray-600 mt-2 text-center'>
           الرجاء كتابة اسم مشروع معين كامل <span className='text-blue-500 font-bold'>لكي يظهر لك بيان الأرباح والخسائر</span> الخاص به
        </p>
        {tableLoading ? (
          <LoadingShow msg="جاري تحميل البيانات..." />
        ) : (
          <ProfitLossTable data={tableData?.profitLossData || []} />
        )}
      </main>
    </>
  );
}