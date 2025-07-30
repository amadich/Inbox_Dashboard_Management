import { getAllTasks, getAllTasksbyProjectId , getTaskById, createTask, updateTask, deleteTask, updateTaskStatus } from "../../services/taskService";

// Define the TaskInput for other mutations
interface TaskInput {
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  cardColor: string;
  projectId: string;
}
// Define the UpdateTaskInput for the updateTask mutation
interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  progress?: number;
  cardColor?: string;
  projectId?: string;
  
}

// Define the TaskStatusUpdateInput for the updateTaskStatus mutation
interface TaskStatusUpdateInput {
  id: string;
  status: string;
}

export const taskResolvers = {
  Query: {
    tasks: async () => {
      return await getAllTasks();
    },

    // getAllTasks function by projectid
    tasksByProjectId: async (_: any, { projectId }: { projectId: string }) => {
      return await getAllTasksbyProjectId(projectId);
    },


    task: async (_: any, { id }: { id: string }) => {
      return await getTaskById(id);
    },
  },

  Mutation: {
    createTask: async (_: any, { task }: { task: TaskInput }) => {
      return await createTask(task);
    },

    updateTask: async (_: any, { id, task }: { id: string, task: UpdateTaskInput }) => {
      return await updateTask(id, task);
    },

    // Add the updateTaskStatus mutation
    updateTaskStatus: async (_: any, { task }: { task: TaskStatusUpdateInput }) => {
      return await updateTaskStatus(task.id, task.status);
    },

    deleteTask: async (_: any, { id }: { id: string }) => {
      return await deleteTask(id);
    },
  },
};
