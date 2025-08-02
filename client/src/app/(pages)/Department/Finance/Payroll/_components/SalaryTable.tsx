'use client';

import { useState, useMemo } from 'react';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import SalaryEditModal from './SalaryEditModal';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import LoadingShow from "@/components/LoadingShow";

const GET_SALARIES = gql`
  query GetSalaries {
    salaries {
      id
      name
      amount
      due
      paid
      updatedAt
    }
  }
`;

const CREATE_SALARY = gql`
  mutation CreateSalary($name: String!, $amount: Float!, $due: String!, $paid: Boolean!) {
    createSalary(name: $name, amount: $amount, due: $due, paid: $paid) {
      id
      name
      amount
      due
      paid
      updatedAt
    }
  }
`;

const UPDATE_SALARY = gql`
  mutation UpdateSalary($id: ID!, $name: String, $amount: Float, $due: String, $paid: Boolean) {
    updateSalary(id: $id, name: $name, amount: $amount, due: $due, paid: $paid) {
      id
      name
      amount
      due
      paid
      updatedAt
    }
  }
`;

const DELETE_SALARY = gql`
  mutation DeleteSalary($id: ID!) {
    deleteSalary(id: $id)
  }
`;

type EmployeeSalary = {
  id: string;
  name: string;
  amount: number;
  due: string;
  paid: boolean;
  updatedAt?: string;
};

export default function SalaryTable() {
  const { data, loading, error, refetch } = useQuery<{ salaries: EmployeeSalary[] }>(GET_SALARIES);
  const [createSalary, { loading: creating }] = useMutation(CREATE_SALARY);
  const [updateSalary, { loading: updating }] = useMutation(UPDATE_SALARY);
  const [deleteSalary, { loading: deleting }] = useMutation(DELETE_SALARY);
  
  const [selected, setSelected] = useState<EmployeeSalary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSalaries = useMemo(() => {
    if (!data?.salaries) return [];
    return data.salaries.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const openEditModal = (emp: EmployeeSalary) => {
    setIsNew(false);
    setSelected(emp);
    setModalOpen(true);
  };

  const openNewModal = () => {
    setIsNew(true);
    setSelected({
      id: 'new',
      name: '',
      amount: 0,
      due: new Date().toISOString().split('T')[0],
      paid: false,
    });
    setModalOpen(true);
  };

  const saveSalary = async (updated: EmployeeSalary) => {
    try {
      if (isNew) {
        await createSalary({
          variables: {
            name: updated.name,
            amount: updated.amount,
            due: updated.due,
            paid: updated.paid
          }
        });
      } else {
        await updateSalary({
          variables: {
            id: updated.id,
            name: updated.name,
            amount: updated.amount,
            due: updated.due,
            paid: updated.paid
          }
        });
      }
      setModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving salary:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSalary({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Error deleting salary:', error);
    }
  };

  if (loading) return <LoadingShow msg='جاري تحميل البيانات...' />;
  if (error) return <div className="text-red-500 p-4">خطأ: {error.message}</div>;

  return (
    <div className="card bg-base-100 shadow-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">الرواتب الشهرية</h2>
        <button 
          className="btn btn-sm btn-success text-white gap-1"
          onClick={openNewModal}
          disabled={creating}
        >
          <PlusIcon className="w-4 h-4" /> إضافة موظف
        </button>
      </div>

      <div className="flex  mb-4">
        <input
          type="text"
          placeholder="بحث عن موظف"
          className="input input-bordered w-full max-w-xs text-right"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>الموظف</th>
              <th>المبلغ</th>
              <th>الاستحقاق</th>
              <th>الحالة</th>
              <th>آخر تعديل</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.amount.toLocaleString()} د.ع</td>
                <td>{emp.due}</td>
                <td>
                  <span className={`badge ${emp.paid ? 'bg-green-400' : 'bg-red-400'}`}>
                    {emp.paid ? 'مدفوعة' : 'غير مدفوعة'}
                  </span>
                </td>
                <td className="text-xs text-gray-500">{emp.updatedAt || '-'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline mr-2"
                    onClick={() => openEditModal(emp)}
                    disabled={updating || deleting}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(emp.id)}
                    disabled={deleting}
                  >
                    {deleting ? 'جاري الحذف...' : 'حذف'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <SalaryEditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data={selected}
          onSave={saveSalary}
          isNew={isNew}
          loading={creating || updating}
        />
      )}
    </div>
  );
}