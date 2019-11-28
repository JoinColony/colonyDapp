import gql from 'graphql-tag';

export const CREATE_COLONY = gql`
    mutation createColony($input: CreateColonyInput!) {
    createColony(input:$input) {
			id
      colonyAddress
      colonyName
      avatarHash
      description
      displayName
      guideline
      website
    }
  }
`;

export const EDIT_COLONY = gql`
  mutation editColony($address: String!) {
    editColony(address: $address) {
	    id
      colonyName
    }
  }
`;
