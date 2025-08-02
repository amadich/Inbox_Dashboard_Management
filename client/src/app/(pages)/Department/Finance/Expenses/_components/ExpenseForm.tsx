'use client';

import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { MinusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Expense } from './ExpenseTable';

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

// New update mutation
const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($id: ID!, $input: ExpenseUpdateInput!) {
    updateExpense(id: $id, input: $input) {
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

interface FormState {
  amount: string;
  description: string;
  date: string;
  project: string;
  mainCategory: string;
  subCategory: string;
}

export function ExpenseForm({ 
  editingExpense, 
  setEditingExpense 
}: { 
  editingExpense: Expense | null; 
  setEditingExpense: (expense: Expense | null) => void;
}) {
  const [form, setForm] = useState<FormState>({
    amount: '',
    description: '',
    date: '',
    project: '',
    mainCategory: '',
    subCategory: '',
  });

  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount.toString(),
        description: editingExpense.description,
        date: editingExpense.date,
        project: editingExpense.project || '',
        mainCategory: editingExpense.mainCategory,
        subCategory: editingExpense.subCategory || '',
      });
    } else {
      setForm({
        amount: '',
        description: '',
        date: '',
        project: '',
        mainCategory: '',
        subCategory: '',
      });
    }
  }, [editingExpense]);

  const [createExpense, { loading: createLoading, error: createError }] = useMutation(CREATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }],
    onCompleted: () => {
      setEditingExpense(null);
    }
  });

  // New update mutation hook
  const [updateExpense, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_EXPENSE, {
    refetchQueries: [{ query: GET_EXPENSES }],
    onCompleted: () => {
      setEditingExpense(null);
    }
  });

  const error = createError || updateError;
  const loading = createLoading || updateLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const input = {
        ...form,
        amount: parseFloat(form.amount)
      };

      if (editingExpense) {
        await updateExpense({
          variables: {
            id: editingExpense.id,
            input
          }
        });
      } else {
        await createExpense({ variables: { input } });
        location.reload(); // Reload to reflect new data
      }
    } catch (err) {
      console.error('Error submitting expense:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-4 space-y-4">
      <div className="flex items-center gap-2">
        <MinusIcon className="w-5 h-5 text-error" />
        <h2 className="text-lg font-semibold">
          {editingExpense ? 'تحديث مصروف' : 'تسجيل مصروف مفصل'}
        </h2>
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

      <div className="flex gap-2">
        <button 
          type="submit" 
          className={`btn  w-36 ${loading ? 'btn-disabled' : 'bg-blue-300'}`}
          disabled={loading}
        >
          {loading 
            ? (editingExpense ? 'جاري التحديث...' : 'جاري الحفظ...') 
            : (editingExpense ? 'تحديث' : 'حفظ')
          }
        </button>
        {editingExpense && (
          <button 
            type="button" 
            className="btn btn-ghost"
            onClick={() => setEditingExpense(null)}
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}