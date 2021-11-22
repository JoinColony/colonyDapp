import { useQuery } from '@apollo/client';

import { AnyUser, UserDocument } from '~data/index';
import UserAvatar, { Props as UserAvatarProps } from '~core/UserAvatar';
import useUserAvatarImageFromIPFS from '~utils/hooks/useUserAvatarImageFromIPFS';
import { withHooks } from '~utils/hoc';

export default withHooks<
  { fetchUser: boolean } | void,
  UserAvatarProps,
  { user: AnyUser | void; avatarURL?: string | null }
>((hookParams, { user, address }) => {
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
  const { image } = useUserAvatarImageFromIPFS(avatarHash as string);
  result.avatarURL = image;
  return result;
})(UserAvatar);
