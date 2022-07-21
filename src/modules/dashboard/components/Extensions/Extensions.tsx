import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension, getExtensionHash } from '@colony/colony-js';

import camelCase from 'lodash/camelCase';

import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import {
  useColonyExtensionsQuery,
  useNetworkExtensionVersionQuery,
} from '~data/index';
import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import extensionData from '~data/staticData/extensionData';

import { dappExtensions } from './index';
import styles from './Extensions.css';

import ExtensionCard from './ExtensionCard';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.title',
    defaultMessage: 'Extensions',
  },
  description: {
    id: 'dashboard.Extensions.description',
    defaultMessage: 'Extend the functionality of your colony with extensions',
  },
  installedExtensions: {
    id: 'dashboard.Extensions.installedExtensions',
    defaultMessage: 'Installed Extensions',
  },
  availableExtensions: {
    id: 'dashboard.Extensions.availableExtensions',
    defaultMessage: 'Available Extensions',
  },
  loading: {
    id: 'dashboard.Extensions.loading',
    defaultMessage: `Loading Extensions`,
  },
});

interface Props {
  colonyAddress: Address;
}

const Extensions = ({ colonyAddress }: Props) => {
  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const { data: networkExtensionData } = useNetworkExtensionVersionQuery();

  // @NOTE get list of installed extensions that are only allowed to be
  // used within the dapp
  const dappInstalledExtensions = useMemo(
    () =>
      data?.processedColony?.installedExtensions?.filter(({ extensionId }) =>
        dappExtensions.includes(Extension[extensionId]),
      ),
    [data],
  );

  const installedExtensionsData = useMemo(() => {
    return (
      dappInstalledExtensions?.map(({ extensionId, address, details }) => {
        return {
          ...extensionData[extensionId],
          address,
          currentVersion: details?.version || 0,
        };
      }) || []
    );
  }, [dappInstalledExtensions]);

  const availableExtensionsData = useMemo(() => {
    if (dappInstalledExtensions) {
      return dappExtensions.reduce((availableExtensions, extensionName) => {
        const installedExtension = dappInstalledExtensions.find(
          ({ extensionId }) => extensionName === extensionId,
        );
        if (
          !installedExtension &&
          networkExtensionData?.networkExtensionVersion
        ) {
          const { networkExtensionVersion } = networkExtensionData;
          const networkExtension = networkExtensionVersion?.find(
            (extension) =>
              extension?.extensionHash === getExtensionHash(extensionName),
          );
          return [
            ...availableExtensions,
            {
              ...extensionData[extensionName],
              currentVersion: networkExtension?.version || 0,
            },
          ];
        }
        return availableExtensions;
      }, []);
    }
    return [];
  }, [dappInstalledExtensions, networkExtensionData]);

  const getDappInstalledExtension = useCallback(
    (index: number) => {
      // guard against stepping outside of the array
      if (
        !dappInstalledExtensions ||
        index >= dappInstalledExtensions?.length
      ) {
        return undefined;
      }
      return dappInstalledExtensions[index];
    },
    [dappInstalledExtensions],
  );

  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <BreadCrumb elements={[MSG.title]} />
        <p className={styles.description}>
          <FormattedMessage {...MSG.description} />
        </p>
        <hr />
        {installedExtensionsData.length ? (
          <>
            <Heading
              tagName="h3"
              appearance={{ size: 'normal', margin: 'double' }}
              text={MSG.installedExtensions}
            />
            <div className={styles.cards}>
              {installedExtensionsData.map((extension, idx) => (
                <ExtensionCard
                  key={extension.extensionId}
                  extension={extension}
                  // be careful to use matching data with both
                  // installedExtensionsData & dappInstalledExtensions
                  installedExtension={getDappInstalledExtension(idx)}
                  dataTest={`${camelCase(extension.extensionId)}ExtensionCard`}
                />
              ))}
            </div>
          </>
        ) : null}
        {availableExtensionsData.length ? (
          <div className={styles.availableExtensionsWrapper}>
            <Heading
              tagName="h3"
              appearance={{ size: 'normal', margin: 'double' }}
              text={MSG.availableExtensions}
            />
            <div className={styles.cards}>
              {availableExtensionsData.map((extension) => (
                <ExtensionCard
                  key={extension.extensionId}
                  extension={extension}
                  dataTest={`${camelCase(extension.extensionId)}ExtensionCard`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Extensions;
