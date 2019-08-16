import { UserType } from '~immutable/index';
import UserAvatar, { Props as UserAvatarProps } from '~core/UserAvatar';
import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import { userSubscriber } from '../../subscribers';
import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchUser: boolean },
  UserAvatarProps,
  { user: UserType | void; avatarURL: string | void }
>(
  (
    { fetchUser = true } = { fetchUser: undefined },
    { user, address } = { user: undefined, address: undefined },
  ) => {
    const result = { user, avatarURL: undefined };
    if (fetchUser) {
      const { data: fetchedUser } = useDataSubscriber<UserType>(
        userSubscriber,
        [address],
        [address],
      );
      result.user = fetchedUser as UserType;
    }
    const avatarHash = result.user ? result.user.profile.avatarHash : undefined;
    const { data: avatarURL } = useDataFetcher<string>(
      ipfsDataFetcher,
      [avatarHash],
      [avatarHash],
    );
    result.avatarURL = avatarURL;
    return result;
  },
)(UserAvatar);
