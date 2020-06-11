import { useQuery } from '@apollo/react-hooks';

import { AnyUser, UserDocument, useLoggedInUser } from '~data/index';
import UserAvatar, { Props as UserAvatarProps } from '~core/UserAvatar';
import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';

import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchUser: boolean } | void,
  UserAvatarProps,
  { user: AnyUser | void; avatarURL: string | void }
>((hookParams, { user, address }) => {
  const result: {
    user: AnyUser | void;
    avatarURL: string | void;
    notSet: boolean | void;
  } = {
    user,
    avatarURL: undefined,
    notSet: true,
  };
  const { ethereal } = useLoggedInUser();
  result.notSet = !!ethereal;
  const { fetchUser } = hookParams || { fetchUser: true };
  if (fetchUser) {
    const { data } = useQuery(UserDocument, { variables: { address } });
    if (data) result.user = data.user;
  }
  const avatarHash =
    result.user && result.user.profile
      ? result.user.profile.avatarHash
      : undefined;
  const { data: avatarURL } = useDataFetcher(
    ipfsDataFetcher,
    [avatarHash as string], // Technically a bug
    [avatarHash],
  );
  result.avatarURL = avatarURL;
  return result;
})(UserAvatar);
