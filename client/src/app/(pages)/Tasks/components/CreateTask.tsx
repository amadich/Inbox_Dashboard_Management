"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "@/app/graphql/Taskqueries";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";

interface CreateTaskProps {
   onClose: () => void;
   selectedStatus: string; // Corrected prop name
   myprojectId: string;
}

export default function CreateTask({ onClose, selectedStatus , myprojectId }: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedStatusLocal, setSelectedStatusLocal] = useState(selectedStatus); // Use passed status as default
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");
  const [progress, setProgress] = useState(10); // Progress state

  const [createTask, { loading, error }] = useMutation(CREATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        variables: {
          task: {
            title,
            description,
            cardColor: selectedColor,
            status: selectedStatusLocal, // Use local status state
            priority: selectedPriority,
            progress, // Send progress value to mutation
            projectId : myprojectId, // Send project ID to mutation
          },
        },

      });
      onClose(); // Close the modal after task is created

      location.reload(); // Reload the page to fetch the new task

    } catch (err: any) {
      console.error("Error creating task:", err.message);
      console.error(err.graphQLErrors);
      console.error(err.networkError);
    }
  };

  return (
    <div className=" modal modal-open fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"> 
      <div className="bg-gradient-to-b from-blue-300 to-blue-400 rounded-lg shadow-xl w-[800px] p-8 space-y-6g shadow-blue-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Image src={SotetelLogo} alt="شعار سوتيتل" width={100} height={100} />
            <h2 className="text-3xl font-semibold text-white">إنشاء <span className="text-black">مهمة جديدة</span></h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-600">عنوان المهمة</label>
              <input
                id="title"
                type="text"
                placeholder="أدخل عنوان المهمة"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-600">وصف المهمة</label>
              <textarea
                id="description"
                placeholder="أدخل وصف المهمة"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Color Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-800">اختر المظهر</label>
              <div className="mt-2 flex gap-2">
                {["brown", "blue", "purple", "pink", "red", "green", "yellow", "orange", "teal", "gray"].map((color) => (
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

            {/* Status and Priority Selection (Badge Style) */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">حالة المهمة</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].map((status) => (
                    <span
                      key={status}
                      onClick={() => setSelectedStatusLocal(status)} // Update local state on click
                      className={`badge cursor-pointer ${selectedStatusLocal === status ? 'badge-success' : 'badge-outline'} hover:scale-110 transition-transform duration-200`}
                    >
                      {status === "TODO" ? "للقيام" :
                       status === "IN_PROGRESS" ? "قيد التنفيذ" :
                       status === "IN_REVIEW" ? "قيد المراجعة" :
                       status === "DONE" ? "منجز" : status}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">أولوية المهمة</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {["LOW", "MEDIUM", "HIGH"].map((priority) => (
                    <span
                      key={priority}
                      onClick={() => setSelectedPriority(priority)}
                      className={`badge cursor-pointer ${selectedPriority === priority ? 'badge-accent' : 'badge-outline'} hover:scale-110 transition-transform duration-200`}
                    >
                      {priority === "LOW" ? "منخفضة" :
                       priority === "MEDIUM" ? "متوسطة" :
                       priority === "HIGH" ? "عالية" : priority}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-600">تقدم المهمة</label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{progress}%</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="mt-2 w-full h-2 bg-indigo-100 rounded-lg appearance-none focus:outline-none"
              />
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-lg">
              <div
                className="h-2 bg-indigo-600 rounded-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#000] text-white rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء المهمة"}
          </button>
          
          {/* Display errors if mutation fails */}
          {error && (
            <div className="mt-4 text-red-600">
              <p>خطأ في إنشاء المهمة: {error.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
