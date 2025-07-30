import { gql } from "@apollo/client";

export const CREATE_ANNOUNCEMENT = gql`
  mutation createAnnouncement($input: AnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      content
      senderId
      sender {
        firstName
        role
      }
      visibility
      visibleTo
    }
  }
`;
