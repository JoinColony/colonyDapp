/* @flow */
import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import type { TransactionType } from '~types/transaction';
import type { RadioOption } from '~core/Fields/RadioGroup';

import { getMainClasses } from '~utils/css';
import Alert from '~core/Alert';
import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import { Form, RadioGroup } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import Duration from '~core/Duration';

import styles from './GasStationPrice.css';

const MSG = defineMessages({
  networkCongestedWarning: {
    id: 'dashboard.GasStationPrice.networkCongestedWarning',
    defaultMessage: `The network is congested and transactions
are expensive. We recommend waiting.`,
  },
  openTransactionSpeedMenuTitle: {
    id: 'dashboard.GasStationPrice.openTransactionSpeedMenuTitle',
    defaultMessage: 'Change Transaction Speed',
  },
  transactionFeeLabel: {
    id: 'dashboard.GasStationPrice.transactionFeeLabel',
    defaultMessage: 'Transaction Fee',
  },
  transactionSpeedLabel: {
    id: 'dashboard.GasStationPrice.transactionSpeedLabel',
    defaultMessage: 'Transaction Speed',
  },
  transactionSpeedTypeSuggested: {
    id: 'dashboard.GasStation.GasStationPrice.transactionSpeedTypeSuggested',
    defaultMessage: 'Suggested',
  },
  transactionSpeedTypeCheaper: {
    id: 'dashboard.GasStation.GasStationPrice.transactionSpeedTypeCheaper',
    defaultMessage: 'Cheaper',
  },
  transactionSpeedTypeFaster: {
    id: 'dashboard.GasStation.GasStationPrice.transactionSpeedTypeFaster',
    defaultMessage: 'Faster',
  },
  walletPromptText: {
    id: 'dashboard.GasStationPrice.walletPromptText',
    defaultMessage: `Finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}  
    }.`,
  },
});

type Props = {
  canSignTransaction: boolean,
  isNetworkCongested: boolean,
  transaction: TransactionType,
  txGasCostsEth: Object,
  walletNeedsAction?: 'metamask' | 'hardware',
};

type State = {
  isSpeedMenuOpen: boolean,
  speedMenuId: string,
};

const transactionSpeedOptions: Array<RadioOption> = [
  { value: 'suggested', label: MSG.transactionSpeedTypeSuggested },
  { value: 'cheaper', label: MSG.transactionSpeedTypeCheaper },
  { value: 'faster', label: MSG.transactionSpeedTypeFaster },
];

class GasStationPrice extends Component<Props, State> {
  static defaultProps = {
    isNetworkCongested: false,
  };

  static displayName = 'GasStationPrice';

  state = {
    isSpeedMenuOpen: false,
    /*
     * `speedMenuId` is used for the tx speed menu's id attribute for aria-* purposes.
     */
    speedMenuId: nanoid(),
  };

  toggleSpeedMenu = () => {
    const { isSpeedMenuOpen } = this.state;
    this.setState({
      isSpeedMenuOpen: !isSpeedMenuOpen,
    });
  };

  render() {
    const {
      canSignTransaction,
      isNetworkCongested,
      txGasCostsEth,
      walletNeedsAction,
    } = this.props;
    const { isSpeedMenuOpen, speedMenuId } = this.state;

    return (
      <div className={getMainClasses({}, styles, { isSpeedMenuOpen })}>
        <Form
          initialValues={{
            transactionSpeed: transactionSpeedOptions[0].value,
          }}
          /* eslint-disable-next-line no-console */
          onSubmit={console.log}
        >
          {({ isSubmitting, values: { transactionSpeed } }) => {
            const transactionFee = txGasCostsEth[transactionSpeed];
            return (
              <Fragment>
                <div
                  aria-hidden={!isSpeedMenuOpen}
                  className={styles.transactionSpeedContainerToggleable}
                  id={speedMenuId}
                >
                  <div className={styles.transactionSpeedContainer}>
                    <div className={styles.transactionSpeedLabel}>
                      <FormattedMessage {...MSG.transactionSpeedLabel} />
                    </div>
                    <RadioGroup
                      appearance={{ theme: 'buttonGroup' }}
                      currentlyCheckedValue={transactionSpeed}
                      name="transactionSpeed"
                      options={transactionSpeedOptions}
                    />
                  </div>
                </div>
                <div className={styles.transactionFeeContainer}>
                  <div className={styles.transactionFeeMenu}>
                    <div className={styles.transactionSpeedMenuButtonContainer}>
                      <button
                        aria-controls={speedMenuId}
                        aria-expanded={isSpeedMenuOpen}
                        className={styles.transactionSpeedMenuButton}
                        disabled={!canSignTransaction}
                        onClick={this.toggleSpeedMenu}
                        type="button"
                      >
                        <Icon
                          appearance={{ size: 'medium' }}
                          name="caret-down-small"
                          title={MSG.openTransactionSpeedMenuTitle}
                        />
                      </button>
                    </div>
                    <div className={styles.transactionFeeInfo}>
                      <div className={styles.transactionFeeLabel}>
                        <FormattedMessage {...MSG.transactionFeeLabel} />
                      </div>
                      <div className={styles.transactionDuration}>
                        <Duration
                          value={txGasCostsEth[`${transactionSpeed}Wait`]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.transactionFeeActions}>
                    <div className={styles.transactionFeeAmount}>
                      {/* @TODO: get estimated gas cost & use here */}
                      <Numeral
                        decimals={18}
                        value={transactionFee}
                        suffix=" ETH"
                      />
                      <div className={styles.transactionFeeEthUsd}>
                        <EthUsd
                          appearance={{ size: 'small', theme: 'grey' }}
                          value={transactionFee}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        disabled={!canSignTransaction}
                        loading={isSubmitting}
                        text={{
                          id: !canSignTransaction
                            ? 'button.loading'
                            : 'button.confirm',
                        }}
                        type="submit"
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          }}
        </Form>
        {(isNetworkCongested || walletNeedsAction) && (
          <div className={styles.walletPromptContainer}>
            {walletNeedsAction ? (
              <Alert
                text={MSG.walletPromptText}
                textValues={{
                  walletType: walletNeedsAction,
                }}
              />
            ) : (
              <Alert text={MSG.networkCongestedWarning} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default GasStationPrice;
