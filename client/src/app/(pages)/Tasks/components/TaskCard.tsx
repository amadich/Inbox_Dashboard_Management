import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { colorMap } from "@/utils/colors";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "@/app/graphql/Taskqueries";
import Swal from "sweetalert2";
import UpdateTask from "./UpdateTask";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: string;
  progress: number;
  cardColor: string;
}

export default function TaskCard({ task }: { task: Task }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // New state for update modal

  // Get color styles from the color map
  const getColorHex = (color: string, shade: number) => {
    return colorMap[color]?.[shade] || "#000000";
  };

  const primaryColor = getColorHex(task.cardColor, 200);
  const secondaryColor = getColorHex(task.cardColor, 100);
  const mainTextColor = getColorHex(task.cardColor, 600);
  const textColor = getColorHex(task.cardColor, 500);
  const progressTextColor = getColorHex(task.cardColor, 700);
  const outlineColor = getColorHex(task.cardColor, 500);
  const badgeColor = getColorHex(task.cardColor, 300);
  const borderColor = getColorHex(task.cardColor, 400);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // New modal handler
  const handleUpdateModal = (action: "open" | "close") => {
    setMenuOpen(false);
    setShowUpdateModal(action === "open");
  };

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, { data }) {
      if (data?.deleteTask) {
        const deletedTaskId = task.id;
        cache.modify({
          fields: {
            tasks(existingTasks = []) {
              return existingTasks.filter((task: Task) => task.id !== deletedTaskId);
            },
          },
        });
      }
    },
    onError(error) {
      console.error("Error deleting task:", error);
    },
  });

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذه المهمة!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفها!",
      cancelButtonText: "إلغاء",
      customClass: {
        container: "swal2-container",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteTask({ variables: { deleteTaskId: task.id } });
        setMenuOpen(false);

        if (Swal) {
          Swal.fire({
            title: "تم بنجاح!",
            text: "تم حذف المهمة بنجاح!",
            icon: "success",
            confirmButtonText: "حسنًا",
            customClass: {
              container: "swal2-container",
            },
            willClose: () => {
              location.reload();
            },
          });
        }
      } catch (error) {
        console.error("Error during task deletion:", error);
        Swal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء حذف المهمة!",
          icon: "error",
          confirmButtonText: "حاول مرة أخرى",
        });
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
      }}
      className="p-4 rounded-lg shadow-md hover:bg-opacity-50 transition duration-300"
    >
      {/* Update Task Modal */}
      {showUpdateModal && (
        <UpdateTask
          taskId={task.id}
          onClose={() => handleUpdateModal("close")}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <div
            style={{ backgroundColor: badgeColor, color: mainTextColor }}
            className="badge border-none font-bold text-xs"
          >
            عميل
          </div>
          <div
            style={{ backgroundColor: badgeColor, color: mainTextColor }}
            className="badge border-none font-bold text-xs"
          >
            فريق
          </div>
        </div>

        <div style={{ borderColor: borderColor }} className="p-1 border rounded-md relative">
          <EllipsisVerticalIcon
            style={{ color: textColor }}
            onClick={toggleMenu}
            className="h-4 w-4 font-bold duration-150 hover:h-5 hover:w-5 cursor-pointer"
          />

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white border-none rounded-lg shadow-lg z-10"
              style={{ backgroundColor: outlineColor }}
            >
              <button
                onClick={() => handleUpdateModal("open")} // Updated click handler
                className="w-full text-left p-2 text-sm text-white hover:bg-[#f1f1f141]"
              >
                تعديل
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left p-2 text-sm text-white hover:bg-[#f1f1f141] rounded-lg"
              >
                حذف المهمة
              </button>
            </div>
          )}
        </div>
      </div>

      <p style={{ color: mainTextColor }} className="font-bold mt-5">
        {task.title}
      </p>

      <p style={{ color: textColor }} className="text-xs font-medium pt-2">
        {task.description}
      </p>

      <div style={{ color: progressTextColor }} className="flex items-center justify-between text-xs font-bold mt-5">
        <p>التقدم</p>
        <p>{task.progress}%</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        {Array(14)
          .fill(null)
          .map((_, index) => {
            const isFilled = index < (task.progress / 100) * 14;
            return (
              <div
                key={index}
                style={{
                  borderColor: outlineColor,
                  backgroundColor: isFilled ? getColorHex(task.cardColor, 500) : getColorHex(task.cardColor, 200),
                }}
                className="badge badge-sm"
              />
            );
          })}
      </div>
    </div>
  );
}