// client/src/app/(pages)/Schedule/components/CreateSchedule.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SCHEDULE } from "@/app/graphql/Schedulequeries";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";

interface CreateScheduleProps {
   onClose: () => void;
   selectedDay: string;
   myprojectId: string;
}

export default function CreateSchedule({ onClose, selectedDay, myprojectId }: CreateScheduleProps) {
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [selectedColor, setSelectedColor] = useState("blue");
   const [selectedDayLocal, setSelectedDayLocal] = useState(selectedDay);

   const [createSchedule, { loading, error }] = useMutation(CREATE_SCHEDULE);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await createSchedule({
            variables: {
               schedule: {
                  title,
                  description,
                  cardColor: selectedColor,
                  day: selectedDayLocal,
                  projectId: myprojectId,
               },
            },
         });
         onClose();
         location.reload();
      } catch (err) {
         console.error("Error creating schedule:", err);
      }
   };

   return (
      <div className="modal modal-open fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
         <div className="bg-gradient-to-bl from-slate-400 to-slate-100 rounded-lg shadow-xl w-[900px] p-6">
            <div className="flex justify-between items-center mb-4">
               <div className="flex items-center space-x-2">
                     <img src={SotetelLogo.src} alt="Logo" width={100} />
                     <h2 className="text-xl font-semibold">إنشاء <span className="text-white">جدول جديد</span></h2>
                </div>
               <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                  <XMarkIcon className="h-6 w-6" />
               </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <input
                     type="text"
                     className="w-full p-2 border rounded input"
                     value={title}
                     placeholder="أدخل عنوان الجدول"
                     onChange={(e) => setTitle(e.target.value)}
                     required
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea
                     className="w-full p-2 border rounded textarea"
                     placeholder="أدخل وصف الجدول"
                     rows={3}
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                  />
               </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">اليوم</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "MONDAY", label: "الاثنين" },
                        { key: "TUESDAY", label: "الثلاثاء" },
                        { key: "WEDNESDAY", label: "الأربعاء" },
                        { key: "THURSDAY", label: "الخميس" },
                        { key: "FRIDAY", label: "الجمعة" },
                        { key: "SATURDAY", label: "السبت" },
                        { key: "SUNDAY", label: "الأحد" },
                      ].map(({ key, label }) => (
                        <button
                           key={key}
                           type="button"
                           onClick={() => setSelectedDayLocal(key)}
                           className={`p-2 text-sm rounded ${selectedDayLocal === key
                             ? "bg-slate-500 text-white"
                             : "bg-gray-200 hover:bg-gray-300"
                             }`}
                        >
                           {label}
                        </button>
                      ))}
                    </div>
                  </div>
               {/* Color Selection */}
               <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-800">اختر المظهر</label>
                  <div className="mt-2 flex gap-2">
                     {["brown", "blue", "purple", "pink", "red", "green", "yellow", "orange", "teal", "gray","emerald"].map((color) => (
                        <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-5 h-5 rounded-full cursor-pointer  transition-all duration-300 ${
                           selectedColor === color ? "border-2 border-black scale-110" : "border-transparent"
                        }`}
                        style={{
                           background: `linear-gradient(135deg, ${color} 30%, rgba(255, 255, 255, 0.5) 70%)`, // Gradient color
                           opacity: 0.8, // Transparency effect
                        }}
                        ></div>
                     ))}
                  </div>
               </div>
               <button
                  type="submit"
                  className="w-full bg-slate-600 text-white py-2 rounded hover:bg-blue-700"
                  disabled={loading}
               >
                  {loading ? "جاري الإنشاء..." : "إنشاء الجدول"}
               </button>
               {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </form>
         </div>
      </div>
   );
}