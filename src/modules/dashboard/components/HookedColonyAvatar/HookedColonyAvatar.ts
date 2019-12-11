import ColonyAvatar, { Props as ColonyAvatarProps } from '~core/ColonyAvatar';
import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import { AnyColony } from '~data/index';

import { ipfsDataFetcher } from '../../../core/fetchers';
import { colonySubscriber } from '../../subscribers';

export default withHooks<
  { fetchColony: boolean },
  ColonyAvatarProps,
  { colony?: AnyColony; avatarURL?: string }
>(({ fetchColony = true }, { colony, colonyAddress }) => {
  const result: { colony?: AnyColony; avatarURL?: string } = {
    colony,
    avatarURL: undefined,
  };

  if (fetchColony) {
    const { data: fetchedColony } = useDataSubscriber(
      colonySubscriber,
      [colonyAddress],
      [colonyAddress],
    );
    result.colony = fetchedColony;
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
