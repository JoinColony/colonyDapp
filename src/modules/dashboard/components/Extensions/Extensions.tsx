import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { extensions, Extension } from '@colony/colony-js';

import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import { useColonyExtensionsQuery } from '~data/index';
import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import extensionData from '~data/staticData/extensionData';

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

  const installedExtensionsData = useMemo(() => {
    if (data?.processedColony?.installedExtensions) {
      const { installedExtensions } = data.processedColony;
      return installedExtensions.map(({ extensionId, address }) => ({
        ...extensionData[extensionId],
        address,
      }));
    }
    return [];
  }, [data]);

  const availableExtensionsData = useMemo(() => {
    if (data?.processedColony?.installedExtensions) {
      const { installedExtensions } = data.processedColony;
      return extensions.reduce((availableExtensions, extensionName) => {
        const installedExtension = installedExtensions.find(
          ({ extensionId }) => extensionName === extensionId,
        );
        /*
         * @NOTE Temporary disable the coin machine extension in the list
         *
         * This will be re-enabled in the Coin Machine feature branch
         */
        if (!installedExtension && extensionName !== Extension.CoinMachine) {
          return [
            ...availableExtensions,
            {
              ...extensionData[extensionName],
            },
          ];
        }
        return availableExtensions;
      }, []);
    }
    return [];
  }, [data]);

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
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.sidebar} />
    </div>
  );
};

export default Extensions;
