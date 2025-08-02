import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProjectSelectionModal({
  isOpen,
  projects,
  onSelect,
  onClose
}: {
  isOpen: boolean;
  projects: string[];
  onSelect: (project: string) => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">اختيار المشروع</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            اختر مشروعًا لعرض بيانات الأرباح والخسائر الخاصة به. يجب اختيار مشروع واحد
            للحصول على تقرير دقيق.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
          {projects.length > 0 ? (
            projects.map(project => (
              <div 
                key={project} 
                className="card bg-base-100 shadow-sm border border-gray-200 hover:border-blue-300 cursor-pointer transition-all"
                onClick={() => onSelect(project)}
              >
                <div className="card-body p-4">
                  <h4 className="card-title text-lg">{project}</h4>
                  <p className="text-gray-500 text-sm">انقر لتحديد هذا المشروع</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">لا توجد مشاريع متاحة</p>
            </div>
          )}
        </div>
        
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}