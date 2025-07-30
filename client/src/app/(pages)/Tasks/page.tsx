"use client";

import { useQuery, useMutation } from "@apollo/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MagnifyingGlassIcon, PlusIcon, EllipsisVerticalIcon , TrophyIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { GET_TASKS_BY_PROJECT_ID, UPDATE_TASK_STATUS } from "@/app/graphql/Taskqueries";
import TaskCard from "./components/TaskCard";
import CreateTask from "./components/CreateTask";
import LoadingShow from "@/components/LoadingShow";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: string;
  progress: number;
  cardColor: string;
  projectId: string;
}

interface ProjectProps {
  projectId: string;
}

export default function TasksPage({ projectId }: ProjectProps) {

  const router = useRouter();

  const todayDate = format(new Date(), "eeee, MMMM dd, yyyy");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("TODO");

  // Fetch tasks data using Apollo Client
  const { data, loading, error } = useQuery(GET_TASKS_BY_PROJECT_ID, {
    variables: { projectId },
  });
  
  // Mutation for updating task status
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    // If the task is dropped in the same column
    if (sourceColumn === destinationColumn) return;

    // Find the dragged task
    const draggedTaskId = result.draggableId;

    // Update the task's status on the server (Apollo mutation)
    try {
      await updateTaskStatus({
        variables: {
          task: {
            id: draggedTaskId,
            status: destinationColumn, // Ensure the destination column name matches the status enum
          },
        },
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  if (loading) {
    const loadingMessage = "جاري تحميل المهام..."; // Translated 'Loading tasks...' to Arabic
    return (
      <>
        <LoadingShow msg={loadingMessage} />
      </>
    )
  };
  if (error) {
    const errorMessage = error.message || "حدث خطأ ما."; // Translated 'An error occurred.' to Arabic
    return (
      <>
        <LoadingShow msg={errorMessage} />
      </>
    )
  }

  const tasks: Task[] = data?.tasksByProjectId || [];

  // Categorize tasks by their status
  const categorizedTasks = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((task) => task.status === "IN_REVIEW"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  // Filter tasks based on search term
  const filteredTasks = Object.keys(categorizedTasks).reduce((acc, status) => {
    const key = status as keyof typeof categorizedTasks;
    acc[key] = categorizedTasks[key].filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return acc;
  }, {} as Record<keyof typeof categorizedTasks, Task[]>);

  // Helper function to format the status column name (Arabic translation for display only)
  const formatColumnName = (column: string) => {
    switch (column) {
      case "TODO":
        return "المهام";
      case "IN_PROGRESS":
        return "قيد التنفيذ";
      case "IN_REVIEW":
        return "قيد المراجعة";
      case "DONE":
        return "منجز";
      default:
        return column.replace(/_/g, " ").toUpperCase();
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-transparent p-8 select-none ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl px-6 py-3 shadow-lg shadow-blue-100">
            <p className="text-sm font-semibold">
              <span>{new Date().getHours() >= 6 && new Date().getHours() < 18 ? "☀️ " : "🌙 "}</span>
              <span>{todayDate} </span>
              <span className="text-sm font-semibold text-blue-100 duration-150 hover:text-white hover:text-lg cursor-none">{currentTime}</span> 
            </p>
            
              
            
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="البحث عن مهمة..."
                className="border border-gray-300 rounded-full py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-2 left-2" />
            </div>
            <button className=" flex items-center bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 text-xs space-x-2" onClick={() => {router.push(`/Projects`)}}> <TrophyIcon className=" w-4 h-4 " /> <span>المشاريع</span></button>
            <button className="flex items-center space-x-1 bg-blue-600 text-white px-6 py-2 rounded-lg text-xs " onClick={() => setIsCreateTaskOpen(true)}>
              <PlusIcon className="h-4 w-4 text-white" /> <p>إضافة مهمة</p>
            </button>
          </div>
        </div>


          {/* Render CreateTask Component */}
          {isCreateTaskOpen && (
            <div>
              <CreateTask onClose={() => setIsCreateTaskOpen(false)} selectedStatus={selectedStatus} myprojectId={projectId} /> {/* Pass onClose function */}
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8">
          {Object.entries(filteredTasks).map(([column, taskList]) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-80 bg-transparent border border-slate-300 rounded-3xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                    <h3 className="font-semibold text-xl text-gray-700">{formatColumnName(column)}</h3> {/* Display formatted column name */}
                    <div className="flex items-center gap-4">
                    <PlusIcon 
                      onClick={() => {setIsCreateTaskOpen(true); setSelectedStatus(column) ; console.log(column)}}  // This will open the CreateTask modal when clicked
                      className="h-4 w-4 text-black duration-150 hover:bg-slate-200 hover:rounded-full cursor-pointer" />
                      <EllipsisVerticalIcon className="h-4 w-4 text-black font-bold" />
                    </div>
                  </div>

                  {taskList.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskCard task={task} /> {/* Pass task data to TaskCard component */}
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
