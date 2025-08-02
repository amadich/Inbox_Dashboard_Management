'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import MovementEditModal from './MovementEditModal';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import LoadingShow from "@/components/LoadingShow";

const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
      id
      type
      amount
      date
      note
      updatedAt
    }
  }
`;

const CREATE_MOVEMENT = gql`
  mutation CreateMovement($type: String!, $amount: Float!, $date: String!, $note: String) {
    createMovement(type: $type, amount: $amount, date: $date, note: $note) {
      id
      type
      amount
      date
      note
      updatedAt
    }
  }
`;

const UPDATE_MOVEMENT = gql`
  mutation UpdateMovement($id: ID!, $type: String, $amount: Float, $date: String, $note: String) {
    updateMovement(id: $id, type: $type, amount: $amount, date: $date, note: $note) {
      id
      type
      amount
      date
      note
      updatedAt
    }
  }
`;

const DELETE_MOVEMENT = gql`
  mutation DeleteMovement($id: ID!) {
    deleteMovement(id: $id)
  }
`;

type Movement = {
  id: string;
  type: string;
  amount: number;
  date: string;
  note?: string;
  updatedAt?: string;
};

// Define type mappings
const MovementTypeMap: Record<string, string> = {
  'إيداع': 'DEPOSIT',
  'سحب': 'WITHDRAWAL',
  'تحويل': 'TRANSFER',
};

const ReverseMovementTypeMap: Record<string, string> = {
  'DEPOSIT': 'إيداع',
  'WITHDRAWAL': 'سحب',
  'TRANSFER': 'تحويل',
};

export default function FinanceMovements() {
  const { data, loading, error, refetch } = useQuery<{ movements: Movement[] }>(GET_MOVEMENTS);
  const [createMovement, { loading: creating }] = useMutation(CREATE_MOVEMENT, {
    onError: (error) => console.error('Create Error:', error)
  });
  const [updateMovement, { loading: updating }] = useMutation(UPDATE_MOVEMENT, {
    onError: (error) => console.error('Update Error:', error)
  });
  const [deleteMovement, { loading: deleting }] = useMutation(DELETE_MOVEMENT, {
    onError: (error) => console.error('Delete Error:', error)
  });
  
  const [selected, setSelected] = useState<Movement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const openEditModal = (mv: Movement) => {
    setIsNew(false);
    setSelected({
      ...mv,
      type: ReverseMovementTypeMap[mv.type] || mv.type
    });
    setModalOpen(true);
  };

  const openNewModal = () => {
    setIsNew(true);
    setSelected({
      id: 'new',
      type: 'إيداع',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
    setModalOpen(true);
  };

  const saveMovement = async (updated: Movement) => {
  try {
    console.log('Sending movement:', updated);
    
    // Send the Arabic type directly (no conversion needed)
    const result = await (isNew ? createMovement : updateMovement)({
      variables: {
        ...(isNew ? {} : { id: updated.id }),
        type: updated.type, // Arabic string
        amount: updated.amount,
        date: updated.date,
        note: updated.note || null
      }
    });
    
    setModalOpen(false);
    refetch();
  } catch (error) {
    console.error('Error saving movement:', error);
  }
};

  const handleDelete = async (id: string) => {
    try {
      await deleteMovement({ variables: { id } });
      refetch();
    } catch (error: any) {
      console.error('Error deleting movement:', error);
      
      let errorMessage = 'حدث خطأ أثناء الحذف';
      if (error.networkError) {
        errorMessage = `خطأ في الشبكة: ${error.networkError.message}`;
      } 
      else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors.map((err: any) => 
          err.message
        ).join(', ');
      }
      
      alert(errorMessage);
    }
  };

  if (loading) return <LoadingShow msg='جاري تحميل البيانات...' />;
  if (error) return <div className="text-red-500 p-4">خطأ: {error.message}</div>;

  return (
    <div className="card bg-base-100 shadow-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">الحركات المالية</h2>
        <button 
          className="btn btn-sm btn-success text-white gap-1"
          onClick={openNewModal}
          disabled={creating}
        >
          <PlusIcon className="w-4 h-4" /> إضافة حركة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>النوع</th>
              <th>المبلغ</th>
              <th>ملاحظة</th>
              <th>آخر تعديل</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.movements.map(mv => {
              const arabicType = ReverseMovementTypeMap[mv.type] || mv.type;
              return (
                <tr key={mv.id} className="group hover:bg-base-200">
                  <td>{mv.date}</td>
                  <td>
                    <span className={`badge ${
                      arabicType === 'إيداع' ? 'bg-green-400' :
                      arabicType === 'سحب' ? 'bg-red-400' : 'bg-blue-400'
                    }`}>{arabicType}</span>
                  </td>
                  <td>{mv.amount.toLocaleString()} د.ع</td>
                  <td>{mv.note || '-'}</td>
                  <td className="text-xs text-gray-500">{mv.updatedAt || '-'}</td>
                  <td className="flex gap-1">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => openEditModal(mv)}
                      disabled={updating || deleting}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(mv.id)}
                      disabled={deleting}
                    >
                      {deleting ? 'جاري الحذف...' : 'حذف'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <MovementEditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data={selected}
          onSave={saveMovement}
          isNew={isNew}
          loading={creating || updating}
        />
      )}
    </div>
  );
}