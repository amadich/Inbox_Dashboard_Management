'use client';

import { useState } from 'react';
import { ExpenseForm } from './_components/ExpenseForm';
import { ExpenseFilter } from './_components/ExpenseFilter';
import { ExpenseTable, Expense as ExpenseType } from './_components/ExpenseTable';
import inboxLogo from "@/assets/images/sotetel_logo.png"
import Image from 'next/image';
import Snowflakes from "@/components/Snowflakes";

export default function ExpensesPage() {
  const [filters, setFilters] = useState({
    date: '',
    category: '',
    project: '',
  });
  const [editingExpense, setEditingExpense] = useState<ExpenseType | null>(null);

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
        إدارة <span className='text-blue-500'>المصروفات</span>
      </h1>
      
      <ExpenseForm 
        editingExpense={editingExpense} 
        setEditingExpense={setEditingExpense} 
      />
      <ExpenseFilter filters={filters} onFilterChange={setFilters} />
      <ExpenseTable 
        filters={filters} 
        setEditingExpense={setEditingExpense} 
      />
    </main>
    </>
  );
}