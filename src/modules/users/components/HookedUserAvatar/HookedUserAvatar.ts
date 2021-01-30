import { useQuery } from '@apollo/client';

import { AnyUser, UserDocument } from '~data/index';
import UserAvatar, { Props as UserAvatarProps } from '~core/UserAvatar';
import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';

import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchUser: boolean } | void,
  UserAvatarProps,
  { user: AnyUser | void; avatarURL?: string | null }
>((hookParams, { user, address }) => {
  let avatarObject = { image: null };
  const result: {
    user: AnyUser | void;
    avatarURL?: string | null;
  } = {
    user,
    avatarURL: undefined,
  };
  const { fetchUser } = hookParams || { fetchUser: true };
  if (fetchUser) {
    const { data } = useQuery(UserDocument, { variables: { address } });
    if (data) result.user = data.user;
  }
  const avatarHash =
    result.user && result.user.profile
      ? result.user.profile.avatarHash
      : undefined;
  const { data: avatar } = useDataFetcher(
    ipfsDataFetcher,
    [avatarHash as string], // Technically a bug
    [avatarHash],
  );
  try {
    avatarObject = JSON.parse(avatar);
  } catch (error) {
    // silent error
  }
  result.avatarURL = avatarObject?.image || null;
  return result;
})(UserAvatar);
