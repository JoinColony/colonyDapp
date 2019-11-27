import gql from 'graphql-tag';

export const CREATE_COLONY = gql`
  mutation createColony($input: CreateColonyInput!) {
    createColony(input:$input) {
			ok
      error
      value {
        id
        colonyName
      }
    }
  }
`;
