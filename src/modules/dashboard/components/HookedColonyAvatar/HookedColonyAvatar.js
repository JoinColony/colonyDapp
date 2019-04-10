/* @flow */

import type { ColonyType } from '~immutable';
import type { Props as ColonyAvatarProps } from '~core/ColonyAvatar';

import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import ColonyAvatar from '~core/ColonyAvatar';

import { colonyFetcher } from '../../fetchers';
import { ipfsDataFetcher } from '../../../core/fetchers';
import useColonyName from '../ColonyGrid/useColonyName';

export default withHooks<
  { fetchColony: boolean },
  ColonyAvatarProps,
  { colony: ?ColonyType, avatarURL: ?string },
>(({ fetchColony = true } = {}, { colony, address } = {}) => {
  const result = { colony, avatarURL: undefined };

  // TODO: as of #1032 we can look up colony by address
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const colonyNameResult = useColonyName(address);
  const colonyName = colonyNameResult ? colonyNameResult.data : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks

  if (fetchColony) {
    const { data: fetchedColony } = useDataFetcher<ColonyType>(
      colonyFetcher,
      [colonyName],
      [colonyName],
    );
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
