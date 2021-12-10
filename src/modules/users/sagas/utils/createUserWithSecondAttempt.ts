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
  UserAddressQuery,
  UserAddressQueryVariables,
  UserAddressDocument,
  UserQuery,
  UserQueryVariables,
  UserDocument,
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
        const { data: userAddressData } = yield apolloClient.query<
          UserAddressQuery,
          UserAddressQueryVariables
        >({
          query: UserAddressDocument,
          variables: {
            name: username,
          },
        });

        const { data: potentialUserData } = yield apolloClient.query<
          UserQuery,
          UserQueryVariables
        >({
          query: UserDocument,
          variables: {
            address: userAddressData?.userAddress,
          },
        });

        user = potentialUserData?.user;
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
    }
    return user;
  } catch (error) {
    log.verbose(`Could not create metadata entry for user ${username}`, error);
  }
  return undefined;
}
