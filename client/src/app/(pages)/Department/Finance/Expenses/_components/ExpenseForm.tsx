'use client';

import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const GET_EXPENSES = gql`
  query GetExpenses {
    expenses {
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

const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: ExpenseInput!) {
    createExpense(input: $input) {
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

export function ExpenseForm() {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: '',
    project: '',
    mainCategory: '',
    subCategory: '',
  });

  const [createExpense, { loading, error }] = useMutation(CREATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense({
        variables: {
          input: {
            ...form,
            amount: parseFloat(form.amount)
          }
        }
      });
      // Reset form
      setForm({
        amount: '',
        description: '',
        date: '',
        project: '',
        mainCategory: '',
        subCategory: '',
      });

      location.reload(); // Reload to reflect changes in the table

    } catch (err) {
      console.error('Error creating expense:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-4 space-y-4">
      <div className="flex items-center gap-2">
        <MinusIcon className="w-5 h-5 text-error" />
        <h2 className="text-lg font-semibold">تسجيل مصروف مفصل</h2>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>خطأ: {error.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          name="amount" 
          type="number" 
          placeholder="المبلغ" 
          className="input input-bordered" 
          value={form.amount}
          onChange={handleChange} 
          required 
        />
        <input 
          name="description" 
          type="text" 
          placeholder="الوصف" 
          className="input input-bordered" 
          value={form.description}
          onChange={handleChange} 
          required 
        />
        <input 
          name="date" 
          type="date" 
          className="input input-bordered" 
          value={form.date}
          onChange={handleChange} 
          required 
        />
        <input 
          name="project" 
          type="text" 
          placeholder="اسم المشروع" 
          className="input input-bordered" 
          value={form.project}
          onChange={handleChange} 
        />

        <select 
          name="mainCategory" 
          className="select select-bordered" 
          value={form.mainCategory} 
          onChange={handleChange} 
          required
        >
          <option value="">اختيار التصنيف الرئيسي</option>
          <option value="رواتب">رواتب</option>
          <option value="تشغيلية">تشغيلية</option>
          <option value="استثمارية">استثمارية</option>
          <option value="أخرى">أخرى</option>
        </select>

        <input 
          name="subCategory" 
          type="text" 
          placeholder="تصنيف فرعي (اختياري)" 
          className="input input-bordered" 
          value={form.subCategory}
          onChange={handleChange} 
        />
      </div>

      <button 
        type="submit" 
        className={`btn ${loading ? 'btn-disabled' : 'bg-blue-300'}`}
        disabled={loading}
      >
        {loading ? 'جاري الحفظ...' : 'حفظ'}
      </button>
    </form>
  );
}