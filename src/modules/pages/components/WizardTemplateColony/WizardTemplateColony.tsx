import React, { ReactNode, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { parseEther } from 'ethers/utils';
import { Redirect } from 'react-router-dom';

import Numeral from '~core/Numeral';
import QRCode from '~core/QRCode';
import CopyableAddress from '~core/CopyableAddress';
import { HistoryNavigation } from '~pages/RouteLayouts';
import { useLoggedInUser } from '~data/index';
import { DEFAULT_NETWORK_TOKEN, ALLOWED_NETWORKS } from '~constants';
import { DASHBOARD_ROUTE } from '~routes/index';

import styles from './WizardTemplateColony.css';

export interface Props {
  children: ReactNode;
  previousStep: () => boolean;
  hideQR: boolean;
}

const MSG = defineMessages({
  wallet: {
    id: 'dashboard.CreateColonyWizard.StepUserENSName.wallet',
    defaultMessage: 'Hello ',
  },
});

const displayName = 'pages.WizardTemplateColony';

const WizardTemplateColony = ({
  children,
  previousStep,
  hideQR = false,
}: Props) => {
  const { balance, walletAddress, networkId } = useLoggedInUser();
  const customHandler = useCallback(() => previousStep(), [previousStep]);
  const ethBalance = parseEther(balance);
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];

  if (!isNetworkAllowed) {
    return <Redirect to={DASHBOARD_ROUTE} />;
  }

  return (
    <main className={styles.layoutMain}>
      <header className={styles.header}>
        <HistoryNavigation customHandler={customHandler} backText=" " />
        <div className={styles.headerWallet}>
          <div className={styles.wallet}>
            <div className={styles.address}>
              <span className={styles.hello}>
                <FormattedMessage {...MSG.wallet} />
              </span>
              <span className={styles.copy}>
                <CopyableAddress>{walletAddress}</CopyableAddress>
              </span>
            </div>
            <div className={styles.moneyContainer}>
              {ethBalance.isZero() ? (
                <div className={styles.noMoney}>
                  <Numeral
                    suffix={` ${DEFAULT_NETWORK_TOKEN.symbol}`}
                    unit="ether"
                    value={ethBalance}
                  />
                </div>
              ) : (
                <div className={styles.yeihMoney}>
                  <Numeral
                    suffix={` ${DEFAULT_NETWORK_TOKEN.symbol}`}
                    unit="ether"
                    value={ethBalance}
                  />
                </div>
              )}
            </div>
          </div>
          {!hideQR && <QRCode address={walletAddress} width={60} />}
        </div>
      </header>
      <article className={styles.content}>{children}</article>
    </main>
  );
};

WizardTemplateColony.displayName = displayName;

export default WizardTemplateColony;
