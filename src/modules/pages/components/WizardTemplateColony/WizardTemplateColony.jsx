/* @flow */
import type { Node } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import BN from 'bn.js';
import { toWei } from 'ethjs-unit';

import Numeral from '~core/Numeral';
import QRCode from '~core/QRCode';
import CopyableAddress from '~core/CopyableAddress';
import { HistoryNavigation } from '~pages/NavigationWrapper';
import { useSelector } from '~utils/hooks';

import type { UserType } from '~immutable';

import { currentUserSelector } from '../../../users/selectors';

import styles from './WizardTemplateColony.css';

export type Props = {|
  children: Node,
  previousStep: (wizardValues?: Object) => void,
  hideQR: boolean,
  wizardValues: Object,
|};

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
  wizardValues,
}: Props) => {
  const currentUser: UserType = useSelector(currentUserSelector);
  const { profile: { walletAddress, balance } = {} } = currentUser || {};
  const customHandler = useCallback(() => previousStep(wizardValues), [
    previousStep,
    wizardValues,
  ]);
  const ethBalance = toWei(balance, 'ether');
  return (
    <main className={styles.layoutMain}>
      <header className={styles.header}>
        <div className={styles.backButton}>
          <HistoryNavigation customHandler={customHandler} backText=" " />
        </div>
        <div className={styles.headerWallet}>
          <div className={styles.wallet}>
            <div className={styles.address}>
              <span className={styles.hello}>
                <FormattedMessage {...MSG.wallet} />
              </span>
              <CopyableAddress>{walletAddress}</CopyableAddress>
            </div>
            <div className={styles.moneyContainer}>
              {new BN(balance).isZero() ? (
                <div className={styles.noMoney}>
                  <Numeral
                    suffix=" ETH"
                    truncate={0}
                    unit="ether"
                    value={ethBalance}
                  />
                </div>
              ) : (
                <div className={styles.yeihMoney}>
                  <Numeral
                    suffix=" ETH"
                    truncate={2}
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
