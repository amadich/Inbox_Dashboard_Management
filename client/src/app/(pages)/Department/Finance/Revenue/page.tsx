'use client';

import { useState } from 'react';
import { RevenueForm } from './_components/RevenueForm';
import { RevenueFilter } from './_components/RevenueFilter';
import { RevenueTable } from './_components/RevenueTable';
import inboxLogo from "@/assets/images/sotetel_logo.png"
import Image from 'next/image';
import Snowflakes from "@/components/Snowflakes";

export default function RevenuesPage() {
  const [filters, setFilters] = useState({
    date: '',
    project: '',
    category: '',
  });
  const [editingRevenue, setEditingRevenue] = useState<any | null>(null);

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
          إدارة <span className='text-green-500'>الإيرادات</span>
        </h1>
        
        <RevenueForm 
          editingRevenue={editingRevenue} 
          setEditingRevenue={setEditingRevenue} 
        />
        <RevenueFilter filters={filters} onFilterChange={setFilters} />
        <RevenueTable 
          filters={filters} 
          setEditingRevenue={setEditingRevenue} 
        />
      </main>
    </>
  );
}