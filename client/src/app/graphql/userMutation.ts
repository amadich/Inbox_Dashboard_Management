import { gql } from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(user: { email: $email, password: $password }) {
      token
    }
  }
`;

export const GET_USERS = gql`
query getAllUsers {
  users {
    id
    firstName
    lastName
    email
    phoneNumber
    status
    role
    birthDate
  }
}
`;

export const DELETE_USER = gql`

    mutation deleteUser($inputDelete: UserInputDelete!) {
      deleteUser(inputDelete: $inputDelete) {
        id
        email
      }
    }
`;