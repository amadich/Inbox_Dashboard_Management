'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RevenueForm } from './_components/RevenueForm';
import { RevenueTable } from './_components/RevenueTable';
import { RevenueFilter } from './_components/RevenueFilter';
import inboxLogo from "@/assets/images/sotetel_logo.png"
import Snowflakes from "@/components/Snowflakes";

export default function RevenuesPage() {
  const [filters, setFilters] = useState({
    date: '',
    project: '',
    category: '',
  });

  return (
    <>
      <Snowflakes />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          <Image src={inboxLogo} alt="Inbox Logo" className="inline-block w-10 h-10 mr-2" />
          الإيرادات <span className='text-blue-500'>المالية</span></h1>

        <RevenueForm />
        <RevenueFilter filters={filters} onFilterChange={setFilters} />
        <RevenueTable filters={filters} />
      </main>
    </>
  );
}
