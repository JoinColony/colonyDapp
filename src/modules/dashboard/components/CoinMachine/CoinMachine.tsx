import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension } from '@colony/colony-js';
import ExternalLink from '~core/ExternalLink';

import { SpinnerLoader } from '~core/Preloaders';
import BreadCrumb, { Crumb } from '~core/BreadCrumb';

import {
  useColonyExtensionsQuery,
  useCoinMachineSaleTokensQuery,
  Colony,
} from '~data/index';

import Chat from './Chat';
import SaleStateWidget, { SaleState } from './SaleStateWidget';
import BuyTokens from './BuyTokens';

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

const LEARN_MORE_LINK = '';

const CoinMachine = ({
  colony: { colonyAddress, colonyName },
  colony,
}: Props) => {
  const { data, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const {
    data: saleTokensData,
    loading: saleTokensLoading,
  } = useCoinMachineSaleTokensQuery({
    variables: { colonyAddress },
  });

  const [saleStarted] = useState<boolean>(false);

  if (
    loading ||
    saleTokensLoading ||
    !data?.processedColony?.installedExtensions
  ) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  const { installedExtensions } = data.processedColony;
  const coinMachineExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.CoinMachine,
  );
  /*
   * Only allow access to the Coin Machine page, if the extension is:
   * - installed
   * - enable
   * - not deprecated
   */
  if (
    !coinMachineExtension ||
    !coinMachineExtension?.details?.initialized ||
    coinMachineExtension?.details?.deprecated
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const saleToken = saleTokensData?.coinMachineSaleTokens?.sellableToken;

  const breadCrumbs: Crumb[] = [
    MSG.title,
    <div>
      <FormattedMessage
        {...MSG.buyTokens}
        values={{ symbol: saleToken?.symbol }}
      />
      <ExternalLink
        className={styles.learnMore}
        text={{ id: 'text.learnMore' }}
        href={LEARN_MORE_LINK}
      />
    </div>,
  ];

  return (
    <div className={styles.main}>
      <BreadCrumb elements={breadCrumbs} />
      <div className={styles.grid}>
        {(saleStarted && (
          <div className={styles.saleStarted}>
            <SaleStateWidget
              state={SaleState.Success}
              price="1234234340000000"
              amount="123423434000000000000"
              timeLeftToNextSale={864000}
              sellableToken={saleToken}
              purchaseToken={
                saleTokensData?.coinMachineSaleTokens?.purchaseToken
              }
            />
          </div>
        )) || (
          <>
            <div className={styles.buy}>
              <BuyTokens
                colony={colony}
                /*
                 * @TODO Determine if the sale is currently ongoing
                 * And only disable it if it insn't
                 */
                disabled={false}
              />
            </div>
            <div className={styles.timeRemaining}>
              <div>Time Remaining</div>
            </div>
            <div className={styles.tokensRemaining}>
              <div>Tokens Remaining</div>
            </div>
          </>
        )}
        <div className={styles.sales}>
          <div>Previous Sales</div>
        </div>
        <div className={styles.comments}>
          <Chat
            colony={colony}
            transactionHash={coinMachineExtension.address}
          />
        </div>
      </div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;
