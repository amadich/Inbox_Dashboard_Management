import Task from "../models/TaskModel";

interface TaskInput {
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  cardColor: string;
  projectId: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  progress?: number;
  cardColor?: string;
  projectId?: string;
}

export const getAllTasks = async () => {
  return await Task.findAll();
};

// Add the getAllTasks function by projectid
export const getAllTasksbyProjectId = async (projectId: string) => {
  const tasks = await Task.findAll({ where: { projectId } });
  return tasks;
};

export const getTaskById = async (id: string) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("Task not found");
  return task;
};

export const createTask = async ({
   title,
   description,
   status,
   priority,
   progress,
   cardColor,
  projectId,
}: TaskInput) => {
  const task = await Task.create({
    title,
    description,
    status, 
    priority,
    progress,
    cardColor,
    projectId,
  });
  return task;
};

export const updateTask = async (id: string, taskData: TaskUpdateInput) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("Task not found");
  await task.update(taskData);
  return task;
};

export const updateTaskStatus = async (id: string, status: string) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("Task not found");

  await task.update({ status });
  return task;
};

export const deleteTask = async (id: string) => {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("Task not found");

  await task.destroy();
  return "Task deleted successfully";
};
