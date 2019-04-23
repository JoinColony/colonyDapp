/* @flow */
import type { Node } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import BN from 'bn.js';
import { toWei } from 'ethjs-unit';

import type { UserType } from '~immutable';

import { useDataFetcher, useSelector } from '~utils/hooks';
import { userFetcher } from '../../../users/fetchers';
import { walletAddressSelector } from '../../../users/selectors';

import Numeral from '~core/Numeral';
import QRCode from '~core/QRCode';
import MaskedAddress from '~core/MaskedAddress';
import { HistoryNavigation } from '~pages/NavigationWrapper';

import styles from './WizardTemplateColony.css';

type Props = {|
  children: Node,
  currentUser: UserType,
  previousStep: (wizardValues?: Object) => void,
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
  wizardValues,
}: Props) => {
  const walletAddress = useSelector(walletAddressSelector);
  const { data: currentUser } = useDataFetcher<UserType>(
    userFetcher,
    [walletAddress],
    [walletAddress],
  );
  const {
    profile: { balance },
  } = currentUser || {};
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
              <MaskedAddress address={walletAddress} />
            </div>
            <div className={styles.moneyContainer}>
              {new BN(balance).isZero() ? (
                <div className={styles.noMoney}>
                  <Numeral
                    decimals={0}
                    value={ethBalance}
                    suffix=" ETH"
                    unit="ether"
                  />
                </div>
              ) : (
                <div className={styles.yeihMoney}>
                  <Numeral
                    decimals={2}
                    value={ethBalance}
                    suffix=" ETH"
                    unit="ether"
                  />
                </div>
              )}
            </div>
          </div>
          <QRCode address={walletAddress} width={60} />
        </div>
      </header>
      <article className={styles.content}>{children}</article>
    </main>
  );
};

WizardTemplateColony.displayName = displayName;

export default WizardTemplateColony;
