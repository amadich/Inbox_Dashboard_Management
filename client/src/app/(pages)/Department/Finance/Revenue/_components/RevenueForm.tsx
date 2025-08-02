'use client';

import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const GET_REVENUES = gql`
  query GetRevenues {
    revenues {
      id
      amount
      source
      date
      project
      category
    }
  }
`;

const CREATE_REVENUE = gql`
  mutation CreateRevenue($input: RevenueInput!) {
    createRevenue(input: $input) {
      id
      amount
      source
      date
      project
      category
    }
  }
`;

const UPDATE_REVENUE = gql`
  mutation UpdateRevenue($id: ID!, $input: RevenueUpdateInput!) {
    updateRevenue(id: $id, input: $input) {
      id
      amount
      source
      date
      project
      category
    }
  }
`;

export function RevenueForm({ 
  editingRevenue, 
  setEditingRevenue 
}: { 
  editingRevenue: any | null; 
  setEditingRevenue: (revenue: any | null) => void;
}) {
  const [form, setForm] = useState({
    amount: '',
    source: '',
    date: '',
    project: '',
    category: '',
  });

  useEffect(() => {
    if (editingRevenue) {
      setForm({
        amount: editingRevenue.amount.toString(),
        source: editingRevenue.source,
        date: editingRevenue.date,
        project: editingRevenue.project || '',
        category: editingRevenue.category || '',
      });
    } else {
      setForm({
        amount: '',
        source: '',
        date: '',
        project: '',
        category: '',
      });
    }
  }, [editingRevenue]);

  const [createRevenue, { loading: createLoading, error: createError }] = useMutation(CREATE_REVENUE, {
    refetchQueries: [{ query: GET_REVENUES }],
    onCompleted: () => {
      setEditingRevenue(null);
    }
  });

  const [updateRevenue, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_REVENUE, {
    refetchQueries: [{ query: GET_REVENUES }],
    onCompleted: () => {
      setEditingRevenue(null);
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

      if (editingRevenue) {
        await updateRevenue({
          variables: {
            id: editingRevenue.id,
            input
          }
        });
      } else {
        await createRevenue({ variables: { input } });
        location.reload();
      }
    } catch (err) {
      console.error('Error submitting revenue:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-4 space-y-4">
      <div className="flex items-center gap-2">
        <PlusIcon className="w-5 h-5 text-success" />
        <h2 className="text-lg font-semibold">
          {editingRevenue ? 'تحديث إيراد' : 'تسجيل إيراد جديد'}
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
          name="source" 
          type="text" 
          placeholder="المصدر" 
          className="input input-bordered" 
          value={form.source}
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

        <input 
          name="category" 
          type="text" 
          placeholder="التصنيف (اختياري)" 
          className="input input-bordered" 
          value={form.category}
          onChange={handleChange} 
        />
      </div>

      <div className="flex gap-2">
        <button 
          type="submit" 
          className={`btn  w-36 ${loading ? 'btn-disabled' : 'bg-green-300'}`}
          disabled={loading}
        >
          {loading 
            ? (editingRevenue ? 'جاري التحديث...' : 'جاري الحفظ...') 
            : (editingRevenue ? 'تحديث' : 'حفظ')
          }
        </button>
        {editingRevenue && (
          <button 
            type="button" 
            className="btn btn-ghost"
            onClick={() => setEditingRevenue(null)}
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}