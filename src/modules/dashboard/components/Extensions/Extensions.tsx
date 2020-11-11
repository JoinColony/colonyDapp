import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { extensions } from '@colony/colony-js';

import BreadCrumb from '~core/BreadCrumb';
import CardList from '~core/CardList';
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
    defaultMessage: 'Extend the functionality of your Colony with extensions',
  },
  installedExtensions: {
    id: 'dashboard.Extensions.installedExtensions',
    defaultMessage: 'Installed Extensions',
  },
  availableExtensions: {
    id: 'dashboard.Extensions.availableExtensions',
    defaultMessage: 'Available Extensions',
  },
});

interface Props {
  colonyAddress: Address;
}

const Extensions = ({ colonyAddress }: Props) => {
  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
  if (loading) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }
  const installedExtensions = data ? data.colony.installedExtensions : [];

  const installedExtensionsData = installedExtensions.map(
    ({ extensionId, address }) => ({
      ...extensionData[extensionId],
      address,
    }),
  );
  const availableExtensionsData = extensions
    .filter(
      (name: string) =>
        !installedExtensions.find(({ extensionId }) => name === extensionId),
    )
    .map((id: string) => ({
      ...extensionData[id],
    }));
  return (
    <div className={styles.main}>
      <BreadCrumb elements={[MSG.title]} />
      <FormattedMessage {...MSG.description} />
      <hr />
      {installedExtensionsData.length ? (
        <div>
          <Heading
            tagName="h3"
            appearance={{ size: 'normal', margin: 'small' }}
            text={MSG.installedExtensions}
          />
          <CardList>
            {installedExtensionsData.map((extension) => (
              <ExtensionCard
                key={extension.extensionId}
                extension={extension}
              />
            ))}
          </CardList>
        </div>
      ) : null}
      {availableExtensionsData.length ? (
        <div className={styles.availableExtensionsWrapper}>
          <Heading
            tagName="h3"
            appearance={{ size: 'normal', margin: 'small' }}
            text={MSG.availableExtensions}
          />
          <CardList>
            {availableExtensionsData.map((extension) => (
              <ExtensionCard
                key={extension.extensionId}
                extension={extension}
              />
            ))}
          </CardList>
        </div>
      ) : null}
    </div>
  );
};

export default Extensions;
