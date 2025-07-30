// client/src/app/(pages)/Schedule/components/ScheduleCard.tsx
import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@apollo/client";
import { DELETE_SCHEDULE } from "@/app/graphql/Schedulequeries";
import Swal from "sweetalert2";
import { colorMap } from "@/utils/colors";

interface Schedule {
  id: string;
  title: string;
  description: string;
  day: string;
  cardColor: string;
}

export default function ScheduleCard({ schedule }: { schedule: Schedule }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE);

  const getColorHex = (color: string, shade: number) => {
    return colorMap[color]?.[shade] || "#000000";
  };

  const primaryColor = getColorHex(schedule.cardColor, 200);
  const secondaryColor = getColorHex(schedule.cardColor, 100);
  const mainTextColor = getColorHex(schedule.cardColor, 600);
  const textColor = getColorHex(schedule.cardColor, 500);
  const badgeColor = getColorHex(schedule.cardColor, 300);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا الجدول!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await deleteSchedule({ variables: { id: schedule.id } });
        Swal.fire("تم الحذف!", "تم حذف الجدول بنجاح.", "success");
         location.reload();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        Swal.fire("خطأ!", "فشل في حذف الجدول.", "error");
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
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <div
            style={{ backgroundColor: badgeColor, color: mainTextColor }}
            className="badge border-none font-bold text-xs"
          >
            {schedule.day.slice(0, 3)}
          </div>
        </div>
        <div className="p-1 rounded-md relative">
          <EllipsisVerticalIcon
            style={{ color: textColor }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-4 w-4 cursor-pointer"
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
              <button
                onClick={handleDelete}
                className="w-full text-left p-2 text-sm hover:bg-gray-100"
              >
                حذف
              </button>
            </div>
          )}
        </div>
      </div>
      <p style={{ color: mainTextColor }} className="font-bold mt-3">
        {schedule.title}
      </p>
      <p style={{ color: textColor }} className="text-xs font-medium pt-1">
        {schedule.description}
      </p>
    </div>
  );
}