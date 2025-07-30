import { gql } from '@apollo/client';

export const GET_ALL_TASKS = gql`
  query getAllTasks {
    tasks {
      id
      title
      description
      status
      priority
      progress
      cardColor
      projectId
    }
  }
`;

export const GET_TASK_BY_ID = gql`
query GetTask($taskId: ID!) {
  task(id: $taskId) {
      id
      title
      description
      status
      priority
      progress
      cardColor
      projectId
  }
}
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($updateTaskId: ID!, $task: UpdateTaskInput!) {
  updateTask(id: $updateTaskId, task: $task) {
    id
    title
    cardColor
    progress
    status
  }
}
`;

export const GET_ALL_TASKS_STATUS = gql`
  query getAllTasks {
    tasks {
      id
      status
    }
  }
`;

export const GET_TASKS_BY_PROJECT_ID = gql`
  query getTasksByProjectId($projectId: ID!) {
    tasksByProjectId(projectId: $projectId) {
      id
      title
      description
      status
      priority
      progress
      cardColor
      projectId
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation updatestatus($task: TaskStatusUpdateInput!) {
    updateTaskStatus(task: $task) {
      id
      title
      status
    }
  }
`;

export const DELETE_TASK = gql`
  mutation destroyTask($deleteTaskId: ID!) {
    deleteTask(id: $deleteTaskId)
  }
`;

export const CREATE_TASK = gql`
  mutation createTask($task: TaskInput!) {
   createTask(task: $task) {
      id
      title
      description
      status
      priority
      progress
      cardColor
      projectId
   }
}
`;