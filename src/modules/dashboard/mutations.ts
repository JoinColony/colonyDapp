import gql from 'graphql-tag';

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
    }
  }
`;

export const SET_TASK_DOMAIN = gql`
  mutation SetTaskDomain($input: SetTaskDomainInput!) {
    setTaskDomain(input: $input) {
      id
      ethDomainId
    }
  }
`;
