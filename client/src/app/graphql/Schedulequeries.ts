import { gql } from "@apollo/client";

export const GET_SCHEDULES_BY_PROJECT_ID = gql`
  query SchedulesByProjectId($projectId: ID!) {
    schedulesByProjectId(projectId: $projectId) {
      id
      title
      description
      day
      cardColor
      projectId
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCHEDULE = gql`
  query Schedule($id: ID!) {
    schedule(id: $id) {
      id
      title
      description
      day
      cardColor
      projectId
    }
  }
`;

export const UPDATE_SCHEDULE_DAY = gql`
  mutation UpdateScheduleDay($schedule: ScheduleDayUpdateInput!) {
    updateScheduleDay(schedule: $schedule) {
      id
      day
    }
  }
`;

export const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($schedule: ScheduleInput!) {
    createSchedule(schedule: $schedule) {
      id
      title
      description
      day
      cardColor
      projectId
    }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!) {
    deleteSchedule(id: $id)
  }
`;