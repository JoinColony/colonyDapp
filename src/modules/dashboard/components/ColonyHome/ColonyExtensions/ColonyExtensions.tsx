import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import { Colony, useColonyExtensionsQuery } from '~data/index';
import { MiniSpinnerLoader } from '~core/Preloaders';
import extensionData from '~data/staticData/extensionData';

import styles from './ColonyExtensions.css';
import NavLink from '~core/NavLink';
import ExtensionStatus from '~dashboard/Extensions/ExtensionStatus';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyExtensions.title',
    defaultMessage: 'Enabled extensions',
  },
  loadingData: {
    id: 'dashboard.ColonyHome.ColonyMembers.loadingData',
    defaultMessage: 'Loading extensions data ...',
  },
});

interface Props {
  colony: Colony;
}

const displayName = 'dashboard.ColonyHome.ColonyExtensions';

const ColonyExtensions = ({ colony: { colonyName, colonyAddress } }: Props) => {
  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  if (loading) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        title={MSG.title}
        loadingText={MSG.loadingData}
      />
    );
  }

  return data?.processedColony ? (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
      </Heading>
      <ul>
        {data.processedColony.installedExtensions
          .filter(
            (extension) =>
              extension.details?.initialized &&
              !extension.details?.missingPermissions.length,
          )
          .map((extension) => {
            const { address, extensionId } = extension;
            return (
              <li key={address} className={styles.extension}>
                <NavLink
                  className={styles.invisibleLink}
                  to={`/colony/${colonyName}/extensions/${extensionId}`}
                  text={extensionData[extensionId].name}
                />
                <ExtensionStatus
                  installedExtension={extension}
                  deprecatedOnly
                />
              </li>
            );
          })}
      </ul>
    </div>
  ) : null;
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
