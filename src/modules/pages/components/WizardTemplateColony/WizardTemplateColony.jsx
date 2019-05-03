/* @flow */
import type { Node } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import compose from 'recompose/compose';
import BN from 'bn.js';
import { toWei } from 'ethjs-unit';

import Numeral from '~core/Numeral';
import QRCode from '~core/QRCode';
import CopyableAddress from '~core/CopyableAddress';
import { HistoryNavigation } from '~pages/NavigationWrapper';
import { withImmutablePropsToJS } from '~utils/hoc';

import type { UserType } from '~immutable';

import { withCurrentUser } from '../../../users/hocs';

import styles from './WizardTemplateColony.css';

type Props = {|
  children: Node,
  currentUser: UserType,
  previousStep: (wizardValues?: Object) => void,
  wizardValues: Object,
  hideQR: boolean,
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
  currentUser: {
    profile: { walletAddress, balance },
  },
  previousStep,
  wizardValues,
  hideQR = false,
}: Props) => {
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
          {!hideQR && <QRCode address={walletAddress} width={60} />}
        </div>
      </header>
      <article className={styles.content}>{children}</article>
    </main>
  );
};

WizardTemplateColony.displayName = displayName;

export default compose(
  withCurrentUser,
  withImmutablePropsToJS,
)(WizardTemplateColony);
