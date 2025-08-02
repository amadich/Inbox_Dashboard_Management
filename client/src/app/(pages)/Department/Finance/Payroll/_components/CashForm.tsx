'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function CashForm() {
  const [cashBox, setCashBox] = useState(3500000);
  const [bankBalance, setBankBalance] = useState(7200000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = cashBox + bankBalance;
    console.log('تم تحديث الأرصدة:', { cashBox, bankBalance, total });
    // TODO: إرسال إلى backend
  };

  return (
    <form onSubmit={handleSubmit} className=" hidden card bg-base-200 shadow-md p-4 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <PencilIcon className="w-5 h-5 text-primary" />
        تعديل أرصدة السيولة
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p>تعديل رصيد الصندوق</p>
        <input
          type="number"
          value={cashBox}
          onChange={(e) => setCashBox(Number(e.target.value))}
          placeholder="رصيد الصندوق"
          className="input input-bordered"
        />
        <p>تعديل رصيد الحساب البنكي</p>
        <input
          type="number"
          value={bankBalance}
          onChange={(e) => setBankBalance(Number(e.target.value))}
          placeholder="رصيد الحساب البنكي"
          className="input input-bordered"
        />
      </div>

      <button type="submit" className="btn bg-success mt-2">حفظ</button>
    </form>
  );
}
