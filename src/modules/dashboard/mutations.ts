import gql from 'graphql-tag';

export const CREATE_COLONY = gql`
  mutation createColony($input: CreateColonyInput!) {
    createColony(input: $input) {
			ok
      error
      value {
        id
        colonyName
      }
    }
  }
`;

export const EDIT_COLONY = gql`
  mutation editColony($address: String!) {
    editColony(address: $address) {
			ok
      error
      value {
        id
        colonyName
      }
    }
  }
`;
