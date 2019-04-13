/* @flow */

import type { ColonyType } from '~immutable';
import type { Props as ColonyAvatarProps } from '~core/ColonyAvatar';

import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import ColonyAvatar from '~core/ColonyAvatar';

import { ipfsDataFetcher } from '../../../core/fetchers';
import { useColonyWithAddress } from '../../hooks';

export default withHooks<
  { fetchColony: boolean },
  ColonyAvatarProps,
  { colony: ?ColonyType, avatarURL: ?string },
>(({ fetchColony = true } = {}, { colony, colonyAddress } = {}) => {
  const result = { colony, avatarURL: undefined };

  if (fetchColony) {
    const { data: fetchedColony } = useColonyWithAddress(colonyAddress);
    result.colony = fetchedColony;
  }
  const avatarHash = result.colony ? result.colony.avatarHash : undefined;
  const { data: avatarURL } = useDataFetcher<string>(
    ipfsDataFetcher,
    [avatarHash],
    [avatarHash],
  );
  result.avatarURL = avatarURL;
  return result;
})(ColonyAvatar);
