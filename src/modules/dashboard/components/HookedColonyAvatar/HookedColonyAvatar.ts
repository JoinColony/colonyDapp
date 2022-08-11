import {
  getColonyAvatarImage,
  getEventMetadataVersion,
} from '@colony/colony-event-metadata-parser';

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
  let avatarObject = { image: null };
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

  if (!avatarURL && avatarHash) {
    const { data: avatar } = useDataFetcher(
      ipfsDataFetcher,
      [avatarHash as string], // Technically a bug, shouldn't need type override
      [avatarHash],
    );
    if (avatar) {
      try {
        const metadataVersion = getEventMetadataVersion(avatar);
        avatarObject =
          metadataVersion === 1
            ? JSON.parse(avatar) // original metadata format
            : { image: getColonyAvatarImage(avatar) }; // new metadata format
      } catch (error) {
        // silent error
      }
    }
    result.avatarURL = avatarObject?.image || null;
  }

  return result;
})(ColonyAvatar);
