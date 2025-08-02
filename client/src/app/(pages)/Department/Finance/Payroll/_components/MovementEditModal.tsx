import { useState, useEffect } from 'react';

type Movement = {
  id: string;
  type: string;
  amount: number;
  date: string;
  note?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Movement;
  onSave: (data: Movement) => void;
  isNew: boolean;
  loading: boolean;
};

export default function MovementEditModal({ 
  isOpen, 
  onClose, 
  data, 
  onSave,
  isNew,
  loading
}: Props) {
  const [formData, setFormData] = useState<Movement>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up note field
    const cleanedData = {
      ...formData,
      note: formData.note?.trim() ? formData.note.trim() : undefined
    };
    
    onSave(cleanedData);
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isNew ? 'إضافة حركة مالية جديدة' : 'تعديل الحركة المالية'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">نوع الحركة</span>
            </label>
            <select
              name="type"
              className="select select-bordered"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="إيداع">إيداع</option>
              <option value="سحب">سحب</option>
              <option value="تحويل">تحويل</option>
            </select>
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
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">التاريخ</span>
            </label>
            <input
              type="date"
              name="date"
              className="input input-bordered"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">ملاحظة</span>
            </label>
            <textarea
              name="note"
              className="textarea textarea-bordered"
              value={formData.note || ''}
              onChange={handleChange}
              rows={2}
            />
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