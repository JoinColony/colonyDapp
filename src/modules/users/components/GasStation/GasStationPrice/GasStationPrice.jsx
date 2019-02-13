/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import BigNumber from 'bn.js';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';
import * as yup from 'yup';

import type { ActionType } from '~types';
import type { GasPricesProps, TransactionType } from '~immutable';
import type { RadioOption } from '~core/Fields/RadioGroup';

import { getMainClasses } from '~utils/css';
import { ACTIONS } from '~redux';
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
    id: 'users.GasStation.GasStationPrice.networkCongestedWarning',
    defaultMessage: `The network is congested and transactions
are expensive. We recommend waiting.`,
  },
  openTransactionSpeedMenuTitle: {
    id: 'users.GasStation.GasStationPrice.openTransactionSpeedMenuTitle',
    defaultMessage: `{disabled, select,
      true {No speed options available}
      false {Open speed menu}
    }`,
  },
  transactionFeeLabel: {
    id: 'users.GasStation.GasStationPrice.transactionFeeLabel',
    defaultMessage: 'Transaction Fee',
  },
  transactionSpeedLabel: {
    id: 'users.GasStation.GasStationPrice.transactionSpeedLabel',
    defaultMessage: 'Transaction Speed',
  },
  transactionSpeedTypeSuggested: {
    id: 'users.GasStation.GasStationPrice.transactionSpeedTypeSuggested',
    defaultMessage: 'Suggested',
  },
  transactionSpeedTypeCheaper: {
    id: 'users.GasStation.GasStationPrice.transactionSpeedTypeCheaper',
    defaultMessage: 'Cheaper',
  },
  transactionSpeedTypeFaster: {
    id: 'users.GasStation.GasStationPrice.transactionSpeedTypeFaster',
    defaultMessage: 'Faster',
  },
  walletPromptText: {
    id: 'users.GasStation.GasStationPrice.walletPromptText',
    defaultMessage: `Finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}
    }.`,
  },
});

type Props = {|
  estimateGas: (id: string) => void,
  gasPrices: GasPricesProps,
  isNetworkCongested: boolean,
  transaction: TransactionType<*, *>,
  updateGas: (id: string, { gasPrice: BigNumber }) => void,
  walletNeedsAction?: 'metamask' | 'hardware',
|};

type State = {|
  isSpeedMenuOpen: boolean,
  speedMenuId: string,
|};

type FormValues = {|
  id: string,
  transactionSpeed: string,
|};

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

  static displayName = 'users.GasStation.GasStationPrice';

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
          submit={ACTIONS.METHOD_TRANSACTION_SENT}
          success={ACTIONS.TRANSACTION_SENT}
          error={ACTIONS.TRANSACTION_ERROR}
          validationSchema={validationSchema}
          isInitialValid={!!initialFormValues.transactionSpeed}
          initialValues={initialFormValues}
          setPayload={(action: ActionType<*, *, *>) => ({
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
            const transactionFee =
              currentGasPrice && gasLimit && currentGasPrice.mul(gasLimit);
            const waitTime = gasPrices[`${transactionSpeed}Wait`];
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
                        onClick: () =>
                          updateGas(id, { gasPrice: currentGasPrice }),
                      }))}
                    />
                  </div>
                </div>
                <div className={styles.transactionFeeContainer}>
                  <div className={styles.transactionFeeMenu}>
                    <div className={styles.transactionSpeedMenuButtonContainer}>
                      <button
                        type="button"
                        aria-controls={speedMenuId}
                        aria-expanded={isSpeedMenuOpen}
                        className={styles.transactionSpeedMenuButton}
                        onClick={this.toggleSpeedMenu}
                        disabled={!waitTime}
                      >
                        <Icon
                          appearance={{ size: 'medium' }}
                          name="caret-down-small"
                          title={MSG.openTransactionSpeedMenuTitle}
                          titleValues={{ disabled: !waitTime }}
                        />
                      </button>
                    </div>
                    <div className={styles.transactionFeeInfo}>
                      <div className={styles.transactionFeeLabel}>
                        <FormattedMessage {...MSG.transactionFeeLabel} />
                      </div>
                      <div className={styles.transactionDuration}>
                        {waitTime && <Duration value={waitTime} />}
                      </div>
                    </div>
                  </div>
                  <div className={styles.transactionFeeActions}>
                    <div className={styles.transactionFeeAmount}>
                      {transactionFee ? (
                        <Fragment>
                          <Numeral
                            decimals={6}
                            value={transactionFee}
                            suffix=" ETH"
                            unit="ether"
                          />
                          <div className={styles.transactionFeeEthUsd}>
                            <EthUsd
                              appearance={{ size: 'small', theme: 'grey' }}
                              decimals={3}
                              value={transactionFee}
                              unit="ether"
                            />
                          </div>
                        </Fragment>
                      ) : (
                        <SpinnerLoader />
                      )}
                    </div>
                    <div>
                      <Button
                        disabled={!isValid}
                        loading={isSubmitting}
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
