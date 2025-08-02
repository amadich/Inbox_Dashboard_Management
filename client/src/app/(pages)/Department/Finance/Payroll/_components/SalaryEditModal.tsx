import { useEffect, useState } from 'react';

type EmployeeSalary = {
  id: string;
  name: string;
  amount: number;
  due: string;
  paid: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: EmployeeSalary;
  onSave: (data: EmployeeSalary) => void;
  isNew: boolean;
  loading: boolean;
};

export default function SalaryEditModal({ 
  isOpen, 
  onClose, 
  data, 
  onSave,
  isNew,
  loading
}: Props) {
  const [formData, setFormData] = useState<EmployeeSalary>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isNew ? 'إضافة موظف جديد' : 'تعديل بيانات الموظف'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">اسم الموظف</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">المبلغ (د.ع)</span>
            </label>
            <input
              type="number"
              name="amount"
              className="input input-bordered"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">تاريخ الاستحقاق</span>
            </label>
            <input
              type="date"
              name="due"
              className="input input-bordered"
              value={formData.due}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">تم الدفع</span>
              <input
                type="checkbox"
                name="paid"
                className="checkbox"
                checked={formData.paid}
                onChange={handleChange}
              />
            </label>
          </div>
          
          <div className="modal-action">
            <button 
              type="button" 
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}