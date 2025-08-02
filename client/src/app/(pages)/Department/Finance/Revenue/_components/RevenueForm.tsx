import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client/core';

// You need to define or import GET_REVENUES. Here is a placeholder definition:
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

export function RevenueForm() {
  const [form, setForm] = useState({
    amount: '',
    source: '',
    date: '',
    project: '',
    category: '',
  });


  const [createRevenue] = useMutation(CREATE_REVENUE, {
    refetchQueries: [{ query: GET_REVENUES }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRevenue({
        variables: {
          input: {
            ...form,
            amount: parseFloat(form.amount)
          }
        }
      });
      // Reset form after successful submission
      setForm({
        amount: '',
        source: '',
        date: '',
        project: '',
        category: '',
      });

      location.reload(); // Reload to reflect changes in the table

    } catch (error) {
      console.error('Submission error:', error);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-4 space-y-4">
      <div className="flex items-center gap-2">
        <PlusIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">تسجيل إيراد جديد</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="amount" type="number" placeholder="المبلغ" className="input input-bordered" onChange={handleChange} required />
        <input name="source" type="text" placeholder="المصدر (مبيعات / خدمات)" className="input input-bordered" onChange={handleChange} required />
        <input name="date" type="date" className="input input-bordered" onChange={handleChange} required />
        <input name="project" type="text" placeholder="اسم المشروع" className="input input-bordered" onChange={handleChange} />
        <input name="category" type="text" placeholder="الفئة" className="input input-bordered" onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">حفظ</button>
    </form>
  );
}
