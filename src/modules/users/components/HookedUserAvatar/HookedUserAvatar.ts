import { useQuery } from '@apollo/client';

import { AnyUser, FaunaUserByAddressDocument } from '~data/index';
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
    const { data } = useQuery(FaunaUserByAddressDocument, {
      variables: { address },
    });
    if (data) result.user = data.user;
  }
  const imageObject = useUserAvatarImageFromIPFS();
  result.avatarURL = imageObject?.image;

  return result;
})(UserAvatar);
