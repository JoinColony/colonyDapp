import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation CreateUser(
    $createUserInput: CreateUserInput!
    $currentUserInput: CurrentUserInput!
  ) {
    # Create user on the server
    createUser(input: $createUserInput) {
      id
    }
    # Set the current user data to the given data
    setCurrentUserData(input: $currentUserInput) @client
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput!) {
    editUser(input: $input) {
      id
    }
  }
`;
