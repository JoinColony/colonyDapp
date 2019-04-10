/* @flow */
import type { Node } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import React from 'react';
import compose from 'recompose/compose';
import BN from 'bn.js';

import Numeral from '~core/Numeral';
import { StepBar } from '~core/ProgressBar';
import QRCode from '~core/QRCode';
import MaskedAddress from '~core/MaskedAddress';
import { HistoryNavigation } from '~pages/NavigationWrapper';
import { withImmutablePropsToJS } from '~utils/hoc';

import type { UserType } from '~immutable';

import { withCurrentUser } from '../../../users/hocs';

import styles from './WizardTemplateColony.css';

type Props = {|
  children: Node,
  step?: number,
  stepCount?: number,
  previousStep: () => void,
  currentUser: UserType,
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
  step,
  stepCount,
  previousStep,
  currentUser: {
    profile: { walletAddress, balance },
  },
}: Props) => (
  <main className={styles.layoutMain}>
    <header className={styles.header}>
      <div className={styles.backButton}>
        <HistoryNavigation customHandler={previousStep} backText=" " />
      </div>
      {stepCount && step && (
        <div className={styles.steps}>
          <StepBar step={step} stepCount={stepCount} />
        </div>
      )}
      <div className={styles.headerWallet}>
        <div className={styles.wallet}>
          <div className={styles.address}>
            <FormattedMessage {...MSG.wallet} />
            <MaskedAddress address={walletAddress} />
          </div>
          <div className={styles.balance}>
            {new BN(balance).isZero() ? (
              <Numeral
                decimals={0}
                value={new BN(balance)}
                suffix=" ETH"
                unit="ether"
              />
            ) : (
              <Numeral
                decimals={2}
                value={new BN(balance)}
                suffix=" ETH"
                unit="ether"
              />
            )}
          </div>
        </div>
        <QRCode address={walletAddress} width={60} />
      </div>
    </header>
    <article className={styles.content}>{children}</article>
  </main>
);

WizardTemplateColony.displayName = displayName;

export default compose(
  withCurrentUser,
  withImmutablePropsToJS,
)(WizardTemplateColony);
