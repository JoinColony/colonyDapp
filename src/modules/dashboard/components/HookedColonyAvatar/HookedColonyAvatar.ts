import ColonyAvatar, { Props as ColonyAvatarProps } from '~core/ColonyAvatar';
import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import { AnyColonyProfile, useColonyQuery } from '~data/index';

import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchColony: boolean },
  ColonyAvatarProps,
  { colony?: AnyColonyProfile; avatarURL?: string }
>(({ fetchColony = true }, { colony, colonyAddress }) => {
  const result: { colony?: AnyColonyProfile; avatarURL?: string } = {
    colony,
    avatarURL: undefined,
  };

  if (fetchColony) {
    const { data } = useColonyQuery({ variables: { address: colonyAddress } });
    if (data) {
      result.colony = data.colony;
    }
  }
  const avatarHash = result.colony ? result.colony.avatarHash : undefined;
  const { data: avatarURL } = useDataFetcher(
    ipfsDataFetcher,
    [avatarHash as string], // Technically a bug, shouldn't need type override
    [avatarHash],
  );
  result.avatarURL = avatarURL;
  return result;
})(ColonyAvatar);
