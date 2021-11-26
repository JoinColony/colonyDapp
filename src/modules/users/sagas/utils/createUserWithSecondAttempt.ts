import { ContextModule, TEMP_getContext } from '~context/index';
import {
  CreateUserDocument,
  CreateUserMutation,
  CreateUserMutationVariables,
  SubscribeToColonyMutation,
  SubscribeToColonyMutationVariables,
  SubscribeToColonyDocument,
  MetaColonyQuery,
  MetaColonyQueryVariables,
  MetaColonyDocument,
} from '~data/index';
import { log } from '~utils/debug';

export function* createUserWithSecondAttempt(username: string) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  try {
    let user;
    /*
     * Create an entry for the user in the database
     */
    const { data: userData } = yield apolloClient.mutate<
      CreateUserMutation,
      CreateUserMutationVariables
    >({
      mutation: CreateUserDocument,
      variables: {
        createUserInput: { username },
      },
    });

    user = userData?.createUser;

    if (!userData?.createUser?.profile?.username) {
      const { data: userDataSecondAttempt } = yield apolloClient.mutate<
        CreateUserMutation,
        CreateUserMutationVariables
      >({
        mutation: CreateUserDocument,
        variables: {
          createUserInput: { username },
        },
      });

      if (!userDataSecondAttempt?.createUser?.profile?.username) {
        throw new Error(`Apollo 'CreateUser' mutation failed`);
      }

      user = userDataSecondAttempt.createUser;
    }

    const { data: metaColonyData } = yield apolloClient.query<
      MetaColonyQuery,
      MetaColonyQueryVariables
    >({
      query: MetaColonyDocument,
    });

    if (metaColonyData?.processedMetaColony?.colonyName) {
      yield apolloClient.mutate<
        SubscribeToColonyMutation,
        SubscribeToColonyMutationVariables
      >({
        mutation: SubscribeToColonyDocument,
        variables: {
          input: {
            colonyAddress: metaColonyData.processedMetaColony.colonyAddress,
          },
        },
      });
    }
    return user;
  } catch (error) {
    log.verbose(`Could not create metadata entry for user ${username}`, error);
  }
  return undefined;
}
