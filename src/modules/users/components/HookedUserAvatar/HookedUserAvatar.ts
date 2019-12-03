import { useQuery } from '@apollo/react-hooks';

import { User } from '~data/types/index';
import UserAvatar, { Props as UserAvatarProps } from '~core/UserAvatar';
import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';

import { ipfsDataFetcher } from '../../../core/fetchers';
import { USER } from '../../queries';

export default withHooks<
  { fetchUser: boolean } | void,
  UserAvatarProps,
  { user: User | void; avatarURL: string | void }
>((hookParams, { user, address }) => {
  const result: { user: User | void; avatarURL: string | void } = {
    user,
    avatarURL: undefined,
  };
  const { fetchUser } = hookParams || { fetchUser: true };
  if (fetchUser) {
    const { data } = useQuery(USER, { variables: { address } });
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
