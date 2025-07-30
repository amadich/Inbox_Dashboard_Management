// client/src/app/(pages)/Schedule/page.tsx
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MagnifyingGlassIcon, PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { GET_SCHEDULES_BY_PROJECT_ID, UPDATE_SCHEDULE_DAY } from "@/app/graphql/Schedulequeries";
import ScheduleCard from "./components/ScheduleCard";
import CreateSchedule from "./components/CreateSchedule";
import LoadingShow from "@/components/LoadingShow";


interface Schedule {
  id: string;
  title: string;
  description: string;
  day: string;
  cardColor: string;
  projectId: string;
}

// interface ProjectProps {
//   projectId: string;
// }

export default function SchedulePage() {
  
  const projectId = "13c63a5d-fae1-4cc5-992f-47ce8bc2192b"; // Replace with actual project ID
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("MONDAY");

  const { data, loading, error } = useQuery(GET_SCHEDULES_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const [updateScheduleDay] = useMutation(UPDATE_SCHEDULE_DAY);

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceDay = source.droppableId;
    const destinationDay = destination.droppableId;

    if (sourceDay === destinationDay) return;

    const draggedScheduleId = result.draggableId;

    try {
      await updateScheduleDay({
        variables: {
          schedule: {
            id: draggedScheduleId,
            day: destinationDay,
          },
        },
      });
    } catch (err) {
      console.error("Error updating schedule day:", err);
    }
  };

  if (loading) return <LoadingShow msg="جاري تحميل الجدول..." />;
  if (error) return <LoadingShow msg={error.message} />;

  const schedules: Schedule[] = data?.schedulesByProjectId || [];
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const dayNameArabic: Record<string, string> = {
    MONDAY: "الاثنين",
    TUESDAY: "الثلاثاء",
    WEDNESDAY: "الأربعاء",
    THURSDAY: "الخميس",
    FRIDAY: "الجمعة",
    SATURDAY: "السبت",
    SUNDAY: "الأحد",
  };

  const categorizedSchedules = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedules.filter((schedule) => schedule.day === day);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const filteredSchedules = Object.keys(categorizedSchedules).reduce((acc, day) => {
    acc[day] = categorizedSchedules[day].filter((schedule) =>
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return acc;
  }, {} as Record<string, Schedule[]>);

  const formatDayName = (day: string) => {
    return dayNameArabic[day] || day;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-white p-8 select-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          <div className=" w-full flex justify-between items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="ابحث في الجداول..."
                className="border border-gray-300 rounded-full py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-2 left-2" />
            </div>
            <div>
              <button
                className="flex items-center space-x-1 bg-cyan-600 text-white px-6 py-2 rounded-lg text-xs"
                onClick={() => setIsCreateScheduleOpen(true)}
              >
                <PlusIcon className="h-4 w-4 text-white" />
                <p>إضافة جدول</p>
              </button>
            </div>
          </div>
        </div>

        {isCreateScheduleOpen && (
          <CreateSchedule
            onClose={() => setIsCreateScheduleOpen(false)}
            selectedDay={selectedDay}
            myprojectId={projectId}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {daysOfWeek.map((day) => (
            <Droppable key={day} droppableId={day}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-60 bg-transparent border border-slate-300 rounded-3xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                    <h3 className="font-semibold text-lg text-gray-700">
                      {formatDayName(day)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <PlusIcon
                        onClick={() => {
                          setIsCreateScheduleOpen(true);
                          setSelectedDay(day);
                        }}
                        className="h-4 w-4 text-black duration-150 hover:bg-slate-200 hover:rounded-full cursor-pointer"
                      />
                      <EllipsisVerticalIcon className="h-4 w-4 text-black font-bold" />
                    </div>
                  </div>

                  {filteredSchedules[day].map((schedule, index) => (
                    <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ScheduleCard schedule={schedule} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}