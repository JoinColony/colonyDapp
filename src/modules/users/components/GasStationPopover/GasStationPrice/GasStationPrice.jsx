/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import BigNumber from 'bn.js';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';
import * as yup from 'yup';

import type { Action } from '~types';
import type { RadioOption } from '~core/Fields/RadioGroup';

import type { TransactionRecord, GasPricesProps } from '~immutable';

import {
  METHOD_TRANSACTION_SENT,
  TRANSACTION_SENT,
  TRANSACTION_ERROR,
} from '../../../../core/actionTypes';

import { getMainClasses } from '~utils/css';
import Alert from '~core/Alert';
import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import { ActionForm, RadioGroup } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import Duration from '~core/Duration';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './GasStationPrice.css';

const MSG = defineMessages({
  networkCongestedWarning: {
    id: 'users.GasStationPopover.GasStationPrice.networkCongestedWarning',
    defaultMessage: `The network is congested and transactions
are expensive. We recommend waiting.`,
  },
  openTransactionSpeedMenuTitle: {
    id: 'users.GasStationPopover.GasStationPrice.openTransactionSpeedMenuTitle',
    defaultMessage: 'Change Transaction Speed',
  },
  transactionFeeLabel: {
    id: 'users.GasStationPopover.GasStationPrice.transactionFeeLabel',
    defaultMessage: 'Transaction Fee',
  },
  transactionSpeedLabel: {
    id: 'users.GasStationPopover.GasStationPrice.transactionSpeedLabel',
    defaultMessage: 'Transaction Speed',
  },
  transactionSpeedTypeSuggested: {
    id: 'users.GasStationPopover.GasStationPrice.transactionSpeedTypeSuggested',
    defaultMessage: 'Suggested',
  },
  transactionSpeedTypeCheaper: {
    id: 'users.GasStationPopover.GasStationPrice.transactionSpeedTypeCheaper',
    defaultMessage: 'Cheaper',
  },
  transactionSpeedTypeFaster: {
    id: 'users.GasStationPopover.GasStationPrice.transactionSpeedTypeFaster',
    defaultMessage: 'Faster',
  },
  walletPromptText: {
    id: 'users.GasStationPopover.GasStationPrice.walletPromptText',
    defaultMessage: `Finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}
    }.`,
  },
});

type Props = {
  canSignTransaction: boolean,
  isNetworkCongested: boolean,
  transaction: TransactionRecord<*, *>,
  walletNeedsAction?: 'metamask' | 'hardware',
  estimateGas: (id: string) => void,
  updateGas: (id: string, { gasPrice: BigNumber }) => void,
  gasPrices: GasPricesProps,
};

type State = {
  isSpeedMenuOpen: boolean,
  speedMenuId: string,
};

type FormValues = {
  id: string,
  transactionSpeed: string,
};

const transactionSpeedOptions: Array<RadioOption> = [
  { value: 'suggested', label: MSG.transactionSpeedTypeSuggested },
  { value: 'cheaper', label: MSG.transactionSpeedTypeCheaper },
  { value: 'faster', label: MSG.transactionSpeedTypeFaster },
];

const validationSchema = yup.object().shape({
  transactionId: yup.string(),
  transactionSpeed: yup
    .string()
    .required()
    .oneOf(transactionSpeedOptions.map(speed => speed.value)),
});

class GasStationPrice extends Component<Props, State> {
  static defaultProps = {
    isNetworkCongested: false,
  };

  static displayName = 'users.GasStationPopover.GasStationPrice';

  state = {
    isSpeedMenuOpen: false,
    /*
     * `speedMenuId` is used for the tx speed menu's id attribute for aria-* purposes.
     */
    speedMenuId: nanoid(),
  };

  componentDidMount() {
    const {
      estimateGas,
      transaction: { id },
    } = this.props;
    estimateGas(id);
  }

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
      gasPrices,
      updateGas,
      transaction: { id, gasLimit },
      walletNeedsAction,
    } = this.props;
    const { isSpeedMenuOpen, speedMenuId } = this.state;
    const initialFormValues: FormValues = {
      id,
      transactionSpeed: transactionSpeedOptions[0].value,
    };
    return (
      <div className={getMainClasses({}, styles, { isSpeedMenuOpen })}>
        <ActionForm
          submit={METHOD_TRANSACTION_SENT}
          success={TRANSACTION_SENT}
          error={TRANSACTION_ERROR}
          validationSchema={validationSchema}
          isInitialValid={!!initialFormValues.transactionSpeed}
          initialValues={initialFormValues}
          setPayload={(action: Action) => ({
            ...action,
            meta: { id },
          })}
        >
          {({
            isSubmitting,
            isValid,
            values: { transactionSpeed },
          }: FormikProps<FormValues>) => {
            const currentGasPrice = gasPrices[transactionSpeed];
            const gasCost =
              currentGasPrice && gasLimit && currentGasPrice.mul(gasLimit);
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
                      options={transactionSpeedOptions.map(option => ({
                        ...option,
                        onClick: () => {
                          // TODO: this isn't really nice, maybe we can factor this out
                          updateGas(id, { gasPrice: currentGasPrice });
                        },
                      }))}
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
                        {Object.keys(gasPrices).length ? (
                          <Duration
                            value={gasPrices[`${transactionSpeed}Wait`]}
                          />
                        ) : (
                          <SpinnerLoader />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.transactionFeeActions}>
                    {gasCost && (
                      <div className={styles.transactionFeeAmount}>
                        <Numeral
                          decimals={18}
                          value={gasCost}
                          suffix=" ETH"
                          unit="ether"
                        />
                        <div className={styles.transactionFeeEthUsd}>
                          <EthUsd
                            appearance={{ size: 'small', theme: 'grey' }}
                            decimals={3}
                            value={gasCost}
                            unit="ether"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <Button
                        disabled={!canSignTransaction || !isValid}
                        loading={isSubmitting || !canSignTransaction}
                        text={{ id: 'button.confirm' }}
                        type="submit"
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          }}
        </ActionForm>
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
