/* @flow */

import type { UserType } from '~immutable';
import type { Props as UserAvatarProps } from '~core/UserAvatar';

import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import UserAvatar from '~core/UserAvatar';

import { userFetcher } from '../../fetchers';
import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchUser: boolean },
  UserAvatarProps,
  { user: ?UserType, avatarURL: ?string },
>(({ fetchUser = true }, { user, address }) => {
  const result: { user: ?UserType, avatarURL?: ?string } = { user };
  const avatarHash = user && user.profile.avatar;
  if (fetchUser) {
    const { data: fetchedUser } = useDataFetcher<UserType>(
      userFetcher,
      [address],
      [address],
    );
    result.user = fetchedUser;
  }
  const { data: avatarURL } = useDataFetcher<string>(
    ipfsDataFetcher,
    [avatarHash],
    [avatarHash],
  );
  result.avatarURL = avatarURL;
  return result;
})(UserAvatar);
