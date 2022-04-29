import isEqual from 'lodash/isEqual';
import findLastIndex from 'lodash/findLastIndex';
import { useState, useEffect } from 'react';

import {
  useSubgraphColonyMetadataQuery,
  Colony,
  ColonyAction,
} from '~data/index';
import { ipfsDataFetcher } from '~modules/core/fetchers';
import { ColonyAndExtensionsEvents, ColonyActions } from '~types/colonyActions';
import {
  getSpecificActionValuesCheck,
  sortMetadataHistory,
  parseColonyMetadata,
} from '~utils/colonyActions';
import { useDataFetcher } from '~utils/hooks';

/*
 * Determine if the current medata is different from the previous one,
 * and in what way
 */
const useColonyMetadataChecks = (
  eventName: string,
  colony: Colony,
  transactionHash: string,
  actionData: Partial<ColonyAction>,
) => {
  let metadataJSON: string | null = null;
  const [metadataIpfsHash, setMetadataIpfsHash] = useState<string>('');
  /*
   * Default fallback, just use the current colony's values
   */
  const [metadataChecks, setMetadataChecks] = useState<{
    [key: string]: boolean;
  }>({
    nameChanged: false,
    logoChanged: false,
    tokensChanged: false,
    verifiedAddressesChanged: false,
  });

  const colonyMetadataHistory = useSubgraphColonyMetadataQuery({
    variables: {
      address: colony.colonyAddress.toLowerCase(),
    },
  });

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: ipfsMetadata } = useDataFetcher(
      ipfsDataFetcher,
      [metadataIpfsHash as string],
      [metadataIpfsHash],
    );
    metadataJSON = ipfsMetadata;
  } catch (error) {
    // silent error
  }
  useEffect(() => {
    if (
      eventName === ColonyAndExtensionsEvents.ColonyMetadata ||
      eventName === ColonyActions.ColonyEdit
    ) {
      if (colonyMetadataHistory?.data?.colony) {
        const {
          data: {
            colony: { metadataHistory },
          },
        } = colonyMetadataHistory;
        const sortedMetadataHistory = sortMetadataHistory(metadataHistory);
        const currentMetadataIndex = findLastIndex(
          sortedMetadataHistory,
          ({ transaction: { id: hash } }) => hash === transactionHash,
        );
        /*
         * We have a previous metadata entry
         */
        if (currentMetadataIndex > 0) {
          const prevMetadata = sortedMetadataHistory[currentMetadataIndex - 1];
          if (prevMetadata) {
            if (prevMetadata.metadata !== metadataIpfsHash) {
              setMetadataIpfsHash(prevMetadata.metadata);
            }

            if (metadataJSON) {
              const prevColonyMetadata = parseColonyMetadata(metadataJSON);
              /*
               * If we have a metadata json, parse into the expected values and then
               * compare them agains the ones from the current action
               *
               * This should be the default case for a colony with metadata history
               */
              const newMetadataChecks = getSpecificActionValuesCheck(
                ColonyAndExtensionsEvents.ColonyMetadata,
                actionData,
                prevColonyMetadata,
              );

              if (!isEqual(newMetadataChecks, metadataChecks)) {
                setMetadataChecks(newMetadataChecks);
              }
            }
          }
        } else if (actionData) {
          /*
           * We don't have a previous metadata entry, so fall back to the current
           * action's values if we can
           */
          const {
            colonyDisplayName: actionColonyDisplayName,
            colonyAvatarHash: actionColonyAvatarHash,
            colonyTokens: actionColonyTokens,
            verifiedAddresses: actionVerifiedAddresses,
          } = actionData;
          const newMetadataValues = {
            nameChanged: !!actionColonyDisplayName,
            logoChanged: !!actionColonyAvatarHash,
            tokensChanged: !!actionColonyTokens?.length,
            verifiedAddressesChanged: !!actionVerifiedAddresses?.length,
          };

          if (!isEqual(newMetadataValues, metadataChecks)) {
            setMetadataChecks(newMetadataValues);
          }
        }
      }
    }
  }, [
    eventName,
    colonyMetadataHistory,
    transactionHash,
    metadataChecks,
    metadataIpfsHash,
    setMetadataIpfsHash,
    metadataJSON,
    actionData,
  ]);

  return metadataChecks;
};

export default useColonyMetadataChecks;
