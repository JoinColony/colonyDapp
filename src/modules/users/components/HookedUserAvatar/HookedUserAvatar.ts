import { UserType } from '~immutable/index';
import UserAvatar, { Props as UserAvatarProps } from '~core/UserAvatar';
import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import { userSubscriber } from '../../subscribers';
import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchUser: boolean } | void,
  UserAvatarProps,
  { user: UserType | void; avatarURL: string | void }
>((hookParams, { user, address }) => {
  const result: { user: UserType | void; avatarURL: string | void } = {
    user,
    avatarURL: undefined,
  };
  const { fetchUser } = hookParams || { fetchUser: true };
  if (fetchUser) {
    const { data: fetchedUser } = useDataSubscriber(
      userSubscriber,
      [address],
      [address],
    );
    result.user = fetchedUser as UserType;
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
