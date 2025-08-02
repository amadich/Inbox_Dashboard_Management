'use client';

import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import LoadingShow from "@/components/LoadingShow";

const GET_CASH_BALANCE = gql`
  query GetCashBalance {
    cashBalance {
      id
      cashBox
      bankBalance
      updatedAt
    }
  }
`;

const UPDATE_CASH_BALANCE = gql`
  mutation UpdateCashBalance($cashBox: Float!, $bankBalance: Float!) {
    updateCashBalance(cashBox: $cashBox, bankBalance: $bankBalance) {
      id
      cashBox
      bankBalance
      updatedAt
    }
  }
`;

type CashBalance = {
  id: string;
  cashBox: number;
  bankBalance: number;
  updatedAt: string;
};

export default function CashSummary() {
  const { data, loading, error } = useQuery<{ cashBalance: CashBalance | null }>(GET_CASH_BALANCE);
  const [updateBalance, { loading: updating }] = useMutation(UPDATE_CASH_BALANCE, {
    refetchQueries: [{ query: GET_CASH_BALANCE }]
  });
  
  const [editOpen, setEditOpen] = useState(false);
  const [localCashBox, setLocalCashBox] = useState(0);
  const [localBankBalance, setLocalBankBalance] = useState(0);

  // Initialize with default values if cashBalance is null
  useEffect(() => {
    if (data?.cashBalance) {
      setLocalCashBox(data.cashBalance.cashBox);
      setLocalBankBalance(data.cashBalance.bankBalance);
    } else {
      // Set default values if no cashBalance exists
      setLocalCashBox(0);
      setLocalBankBalance(0);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateBalance({
        variables: {
          cashBox: localCashBox,
          bankBalance: localBankBalance
        }
      });
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating cash balance:', error);
    }
  };

  if (loading) return <LoadingShow msg='جاري تحميل البيانات...' />;
  if (error) return <div className="text-red-500 p-4">خطأ: {error.message}</div>;

  return (
    <>
      <div className="card bg-base-100 shadow-md p-4 relative group">
        <h2 className="text-lg font-semibold mb-4">أرصدة السيولة</h2>

        <button
          className="btn btn-sm btn-ghost absolute top-2 left-36 invisible group-hover:visible"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat bg-green-200 p-4 rounded border-2 border-green-600">
            <div className="stat-title">رصيد الصندوق</div>
            <div className="stat-value text-green-600">
              {localCashBox.toLocaleString()} د.ع
            </div>
          </div>

          <div className="stat bg-red-200 p-4 rounded border-2 border-red-600">
            <div className="stat-title">رصيد الحساب البنكي</div>
            <div className="stat-value text-red-600">
              {localBankBalance.toLocaleString()} د.ع
            </div>
          </div>

          <div className="stat bg-transparent p-4 rounded border-2 border-blue-300">
            <div className="stat-title">الإجمالي</div>
            <div className="stat-value text-blue-600">
              {(localCashBox + localBankBalance).toLocaleString()} د.ع
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <dialog id="cash_modal" className="modal modal-open">
          <div className="modal-box space-y-4">
            <h3 className="font-bold text-lg">تعديل أرصدة السيولة</h3>
            <p>تعديل رصيد الصندوق ورصيد الحساب البنكي</p>
            <input
              type="number"
              placeholder="رصيد الصندوق"
              className="input input-bordered w-full"
              value={localCashBox}
              onChange={(e) => setLocalCashBox(Number(e.target.value))}
            />
            <p>تعديل رصيد الحساب البنكي</p>
            <input
              type="number"
              placeholder="رصيد الحساب البنكي"
              className="input input-bordered w-full"
              value={localBankBalance}
              onChange={(e) => setLocalBankBalance(Number(e.target.value))}
            />

            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setEditOpen(false)}
                disabled={updating}
              >
                إلغاء
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={updating}
              >
                {updating ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}