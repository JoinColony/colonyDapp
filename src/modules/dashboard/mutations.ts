import gql from 'graphql-tag';

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ok
      error
      value{
        colonyAddress
        creatorAddress
        ethDomainId
        ethTaskId
      }
    }
  }
`;
