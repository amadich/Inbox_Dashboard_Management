import { gql } from '@apollo/client';

export const GET_ACTIVITIES = gql`
  query GetActivities {
    activities {
      id
      actionType
      entityType
      entityId
      details
      timestamp
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;