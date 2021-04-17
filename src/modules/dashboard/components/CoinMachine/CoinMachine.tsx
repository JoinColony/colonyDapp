import React from 'react';
import { Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Extension } from '@colony/colony-js';

import { SpinnerLoader } from '~core/Preloaders';

import { useColonyExtensionsQuery, Colony } from '~data/index';

import styles from './CoinMachine.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Extensions.loading',
    defaultMessage: `Loading Buy Tokens`,
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.CoinMachine';

const CoinMachine = ({ colony: { colonyAddress, colonyName } }: Props) => {
  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

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

  if (data?.processedColony?.installedExtensions) {
    const { installedExtensions } = data.processedColony;
    const coinMachineExtension = installedExtensions.find(
      ({ extensionId }) => extensionId === Extension.CoinMachine,
    );
    if (!coinMachineExtension) {
      return <Redirect to={`/colony/${colonyName}`} />;
    }
  }

  return <div className={styles.main}>Coin Machine</div>;
};

CoinMachine.displayName = displayName;

export default CoinMachine;
