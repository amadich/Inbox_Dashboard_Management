import { gql } from '@apollo/client';

export const GET_ALL_CONTACTS = gql`
  query GetAllContacts {
    getAllContacts {
      id
      priority
      fullName
      phone
      address
      city
      state
      zip
      notes
    }
  }
`;

export const GET_CONTACTS_BY_PRIORITY = gql`
  query GetContactsByPriority($priority: ContactPriority!) {
    getContactsByPriority(priority: $priority) {
      id
      priority
      fullName
      phone
      address
      city
      state
      zip
      notes
    }
  }
`;
export const GET_CONTACT_BY_ID = gql`
  query GetContactById($id: ID!) {
    getContactById(id: $id) {
      id
      priority
      fullName
      phone
      address
      city
      state
      zip
      notes
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateUserContactInput!) {
    createContact(input: $input) {
      id
      fullName
      phone
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $input: UpdateUserContactInput!) {
    updateContact(id: $id, input: $input) {
      id
      fullName
      phone
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;