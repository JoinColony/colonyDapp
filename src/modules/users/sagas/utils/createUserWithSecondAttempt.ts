import { ContextModule, TEMP_getContext } from '~context/index';
import {
  FaunaCreateUserDocument,
  FaunaCreateUserMutation,
  FaunaCreateUserMutationVariables,
  FaunaUserByNameQuery,
  FaunaUserByNameQueryVariables,
  FaunaUserByNameDocument,
} from '~data/index';
import { log } from '~utils/debug';

export function* createUserWithSecondAttempt(
  username: string,
  reattempt = false,
) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  if (!username) {
    return undefined;
  }

  try {
    let user;

    if (reattempt) {
      try {
        const { data: potentialUserData } = yield apolloClient.query<
          FaunaUserByNameQuery,
          FaunaUserByNameQueryVariables
        >({
          query: FaunaUserByNameDocument,
          variables: {
            username,
          },
        });

        user = potentialUserData?.faunaUserByName;
      } catch (error) {
        log.verbose(
          `User with username ${username} was not found, attempting to create a new entry`,
          error.message,
        );
      }
    }

    if (!user?.profile?.username) {
      /*
       * Create an entry for the user in the database
       */
      const { data: userData } = yield apolloClient.mutate<
        FaunaCreateUserMutation,
        FaunaCreateUserMutationVariables
      >({
        mutation: FaunaCreateUserDocument,
        variables: {
          createUserInput: { username },
        },
      });

      user = userData?.faunaCreateUser;

      if (!user?.profile?.username) {
        const { data: userDataSecondAttempt } = yield apolloClient.mutate<
          FaunaCreateUserMutation,
          FaunaCreateUserMutationVariables
        >({
          mutation: FaunaCreateUserDocument,
          variables: {
            createUserInput: { username },
          },
        });

        if (!userDataSecondAttempt?.faunaCreateUser?.profile?.username) {
          throw new Error(`Apollo 'CreateUser' mutation failed`);
        }

        user = userDataSecondAttempt.faunaCreateUser;
      }
    }
    return user;
  } catch (error) {
    log.verbose(`Could not create metadata entry for user ${username}`, error);
  }
  return undefined;
}
