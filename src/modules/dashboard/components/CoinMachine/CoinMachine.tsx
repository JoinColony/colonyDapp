import React from 'react';
import { Redirect } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Extension } from '@colony/colony-js';

import { SpinnerLoader } from '~core/Preloaders';
import BreadCrumb, { Crumb } from '~core/BreadCrumb';

import { useColonyExtensionsQuery, Colony } from '~data/index';

import styles from './CoinMachine.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.CoinMachine.loading',
    defaultMessage: `Loading Buy Tokens`,
  },
  title: {
    id: 'dashboard.CoinMachine.title',
    defaultMessage: `Tokens`,
  },
  buyTokens: {
    id: 'dashboard.CoinMachine.buyTokens',
    defaultMessage: 'Buy {symbol}',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.CoinMachine';

const CoinMachine = ({
  colony: { colonyAddress, colonyName, nativeTokenAddress, tokens },
}: Props) => {
  const { formatMessage } = useIntl();
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

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const breadCrumbs: Crumb[] = [
    MSG.title,
    formatMessage(MSG.buyTokens, { symbol: nativeToken?.symbol }),
  ];

  return (
    <div className={styles.main}>
      <BreadCrumb elements={breadCrumbs} />
      <div className={styles.grid}>Grid</div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;
