import React, { ReactNode, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { toWei } from 'ethjs-unit';

import Numeral from '~core/Numeral';
import QRCode from '~core/QRCode';
import CopyableAddress from '~core/CopyableAddress';
import { HistoryNavigation } from '~pages/RouteLayouts';
import { useLoggedInUser } from '~data/index';

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
  const { balance, walletAddress } = useLoggedInUser();
  const customHandler = useCallback(() => previousStep(), [previousStep]);
  const ethBalance = toWei(balance, 'ether');
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
                  <Numeral suffix=" ETH" unit="ether" value={ethBalance} />
                </div>
              ) : (
                <div className={styles.yeihMoney}>
                  <Numeral suffix=" ETH" unit="ether" value={ethBalance} />
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
