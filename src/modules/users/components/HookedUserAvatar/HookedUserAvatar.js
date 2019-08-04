/* @flow */

import type { UserType } from '~immutable';
import type { Props as UserAvatarProps } from '~core/UserAvatar';

import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import UserAvatar from '~core/UserAvatar';

import { userSubscriber } from '../../subscribers';
import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchUser: boolean },
  UserAvatarProps,
  { user: ?UserType, avatarURL: ?string },
>(({ fetchUser = true } = {}, { user, address } = {}) => {
  const result = { user, avatarURL: undefined };
  if (fetchUser) {
    const { data: fetchedUser } = useDataSubscriber<UserType>(
      userSubscriber,
      [address],
      [address],
      { alwaysSubscribe: false },
    );
    result.user = fetchedUser;
  }
  const avatarHash = result.user ? result.user.profile.avatarHash : undefined;
  const { data: avatarURL } = useDataFetcher<string>(
    ipfsDataFetcher,
    [avatarHash],
    [avatarHash],
  );
  result.avatarURL = avatarURL;
  return result;
})(UserAvatar);
