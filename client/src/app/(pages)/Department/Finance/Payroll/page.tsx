'use client';

import CashSummary from './_components/CashSummary';
import SalaryTable from './_components/SalaryTable';

import inboxLogo from "@/assets/images/sotetel_logo.png"
import Image from 'next/image';
import Snowflakes from "@/components/Snowflakes";

export default function FinancePage() {
  return (
    <>
      <Snowflakes />
        <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          <Image 
            src={inboxLogo} 
            alt="Inbox Logo" 
            width={40}
            height={40}
            className="inline-block mr-2" 
          />
          الأموال <span className='text-blue-500'>والرواتب</span>
        </h1>
        
        <CashSummary />
        <SalaryTable />
        
      </main>
    </>
  );
}