import { ContextModule, TEMP_getContext } from '~context/index';
import {
  UserReputationQuery,
  UserReputationQueryVariables,
  UserReputationDocument,
} from '~data/index';
import { Address } from '~types/index';

export function* updateUserReputation(
  colonyAddress: Address,
  userAddress: Address,
  domainId: number,
) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  yield apolloClient.query<UserReputationQuery, UserReputationQueryVariables>({
    query: UserReputationDocument,
    variables: {
      colonyAddress,
      address: userAddress,
      domainId,
    },
    fetchPolicy: 'network-only',
  });
}
