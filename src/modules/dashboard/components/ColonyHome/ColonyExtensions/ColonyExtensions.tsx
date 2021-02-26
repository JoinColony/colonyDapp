import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import { Colony, useColonyExtensionsQuery } from '~data/index';
import { SpinnerLoader } from '~core/Preloaders';
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
    defaultMessage: 'Loading enabled extensions information...',
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

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
      </Heading>
      {data?.processedColony && !loading ? (
        <ul>
          {data.processedColony.installedExtensions
            .filter(
              (extension) =>
                extension.details.initialized &&
                !extension.details.missingPermissions.length,
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
      ) : (
        <>
          <SpinnerLoader />
          <span className={styles.loadingText}>
            <FormattedMessage {...MSG.loadingData} />
          </span>
        </>
      )}
    </div>
  );
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
