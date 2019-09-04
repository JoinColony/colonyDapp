import { ColonyType } from '~immutable/index';
import ColonyAvatar, { Props as ColonyAvatarProps } from '~core/ColonyAvatar';
import { useDataFetcher } from '~utils/hooks';
import { withHooks } from '~utils/hoc';
import { ipfsDataFetcher } from '../../../core/fetchers';
import { useColonyWithAddress } from '../../hooks/useColony';

export default withHooks<
  { fetchColony: boolean },
  ColonyAvatarProps,
  { colony?: ColonyType; avatarURL: string | void }
>(({ fetchColony = true }, { colony, colonyAddress }) => {
  const result: { colony?: ColonyType; avatarURL: string | void } = {
    colony,
    avatarURL: undefined,
  };

  if (fetchColony) {
    const { data: fetchedColony } = useColonyWithAddress(colonyAddress);
    result.colony = fetchedColony as ColonyType;
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
