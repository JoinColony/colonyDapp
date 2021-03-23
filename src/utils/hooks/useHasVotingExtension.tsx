import { useMemo } from 'react';

import { ColonyExtensionsQuery } from '~data/generated';
import { ExtensionIds } from '~immutable/index';

export const useHasVotingExtension = (data?: ColonyExtensionsQuery) => {
  return useMemo(
    () =>
      data?.processedColony?.installedExtensions
        .filter((extension) => extension.details.initialized)
        .find(
          (extension) =>
            extension.extensionId === ExtensionIds.VOTING_REPUTATION,
        ) !== undefined,
    [data],
  );
};
