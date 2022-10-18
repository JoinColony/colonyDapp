import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getExtensionHash } from '@colony/colony-js';
import camelCase from 'lodash/camelCase';

import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import {
  useColonyExtensionsQuery,
  useNetworkExtensionVersionQuery,
} from '~data/index';
import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import { extensionData, allAllowedExtensions } from '~data/staticData/';

import ExtensionCard from './ExtensionCard';

import styles from './Extensions.css';

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

  console.log('GOT HERE 1');
  console.log(
    '🚀 ~ file: Extensions.tsx ~ line 58 ~ installedExtensionsData ~ data?.processedColony?.installedExtensions',
    data?.processedColony?.installedExtensions,
  );

  const installedExtensionsData = useMemo(() => {
    if (data?.processedColony?.installedExtensions) {
      const { installedExtensions } = data.processedColony;
      return installedExtensions.map(({ extensionId, address, details }) => ({
        ...extensionData[extensionId],
        address,
        currentVersion: details?.version || 0,
      }));
    }
    return [];
  }, [data]);
  console.log(
    '🚀 ~ file: Extensions.tsx ~ line 67 ~ installedExtensionsData ~ installedExtensionsData',
    installedExtensionsData,
  );

  const availableExtensionsData = useMemo(() => {
    if (data?.processedColony?.installedExtensions) {
      const { installedExtensions } = data.processedColony;
      console.log(
        '🚀 ~ file: Extensions.tsx ~ line 73 ~ availableExtensionsData ~ installedExtensions',
        installedExtensions,
      );

      return allAllowedExtensions.reduce(
        (availableExtensions, extensionName) => {
          const installedExtension = installedExtensions.find(
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
            console.log(
              '🚀 ~ file: Extensions.tsx ~ line 98 ~ availableExtensionsData ~ networkExtension',
              networkExtension,
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
        },
        [],
      );
    }
    return [];
  }, [data, networkExtensionData]);
  console.log(
    '🚀 ~ file: Extensions.tsx ~ line 103 ~ availableExtensionsData',
    availableExtensionsData,
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

  const installedExtensions = data
    ? data.processedColony.installedExtensions
    : [];

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
                  installedExtension={installedExtensions[idx]}
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
