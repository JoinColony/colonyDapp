import ColonyAvatar, { Props as ColonyAvatarProps } from '~core/ColonyAvatar';
import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import { AnyColonyProfile, useProcessedColonyQuery } from '~data/index';

import { ipfsDataFetcher } from '../../../core/fetchers';

export default withHooks<
  { fetchColony: boolean },
  ColonyAvatarProps,
  { colony?: AnyColonyProfile; avatarURL?: string | null }
>(({ fetchColony = true }, { colony, colonyAddress }) => {
  const result: { colony?: AnyColonyProfile; avatarURL?: string | null } = {
    colony,
    avatarURL: undefined,
  };

  if (fetchColony) {
    const { data } = useProcessedColonyQuery({
      variables: { address: colonyAddress },
    });
    if (data) {
      result.colony = data.processedColony;
    }
  }
  const avatarHash = result.colony ? result.colony.avatarHash : null;
  const avatarURL = result.colony ? result.colony.avatarURL : null;
  result.avatarURL = avatarURL;

  if (!avatarURL) {
    const { data: fetchedAvatarURL } = useDataFetcher(
      ipfsDataFetcher,
      [avatarHash as string], // Technically a bug, shouldn't need type override
      [avatarHash],
    );
    result.avatarURL = fetchedAvatarURL;
  }

  return result;
})(ColonyAvatar);
