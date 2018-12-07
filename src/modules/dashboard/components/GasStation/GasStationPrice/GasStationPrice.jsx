/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';
import * as yup from 'yup';

import type { TransactionType } from '~types/transaction';
import type { EstimatedGasCost } from '~utils/external';
import type { RadioOption } from '~core/Fields/RadioGroup';

import { getMainClasses } from '~utils/css';
import { getEstimatedGasCost } from '~utils/external';
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
  walletNeedsAction?: 'metamask' | 'hardware',
};

type State = {
  estimatedGasCost: EstimatedGasCost | null,
  isSpeedMenuOpen: boolean,
  speedMenuId: string,
};

type FormValues = {
  transactionHash?: string,
  transactionSpeed: string,
};

const transactionSpeedOptions: Array<RadioOption> = [
  { value: 'suggested', label: MSG.transactionSpeedTypeSuggested },
  { value: 'cheaper', label: MSG.transactionSpeedTypeCheaper },
  { value: 'faster', label: MSG.transactionSpeedTypeFaster },
];

const validationSchema = yup.object().shape({
  transactionHash: yup.string(),
  transactionSpeed: yup
    .string()
    .required()
    .oneOf(transactionSpeedOptions.map(speed => speed.value)),
});

class GasStationPrice extends Component<Props, State> {
  static defaultProps = {
    isNetworkCongested: false,
  };

  static displayName = 'GasStationPrice';

  state = {
    estimatedGasCost: null,
    isSpeedMenuOpen: false,
    /*
     * `speedMenuId` is used for the tx speed menu's id attribute for aria-* purposes.
     */
    speedMenuId: nanoid(),
  };

  componentDidMount() {
    this.mounted = true;
    getEstimatedGasCost().then(estimatedGasCost => {
      if (this.mounted) {
        this.setState({
          estimatedGasCost,
        });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;

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
      transaction: { hash },
      walletNeedsAction,
    } = this.props;
    const { estimatedGasCost, isSpeedMenuOpen, speedMenuId } = this.state;
    const initialFormValues: FormValues = {
      transactionHash: hash,
      transactionSpeed: transactionSpeedOptions[0].value,
    };
    return (
      <div className={getMainClasses({}, styles, { isSpeedMenuOpen })}>
        <ActionForm
          // @TODO: use actual actions here
          submit="TRANSACTION_SIGNATURE_CREATE"
          success="TRANSACTION_SIGNATURE_SUCCESS"
          error="TRANSACTION_SIGNATURE_ERROR"
          validationSchema={validationSchema}
          isInitialValid={!!initialFormValues.transactionSpeed}
          // eslint-disable-next-line no-console
          onSuccess={console.log}
          initialValues={initialFormValues}
        >
          {({
            isSubmitting,
            isValid,
            values: { transactionSpeed },
          }: FormikProps<FormValues>) => {
            const transactionFee =
              estimatedGasCost && estimatedGasCost[transactionSpeed];
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
                        {estimatedGasCost ? (
                          <Duration
                            value={estimatedGasCost[`${transactionSpeed}Wait`]}
                          />
                        ) : (
                          <SpinnerLoader />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.transactionFeeActions}>
                    {transactionFee && (
                      <div className={styles.transactionFeeAmount}>
                        {/* @TODO: get estimated gas cost & use here */}
                        <Numeral
                          decimals={18}
                          value={transactionFee}
                          suffix=" ETH"
                          unit="gwei"
                        />
                        <div className={styles.transactionFeeEthUsd}>
                          <EthUsd
                            appearance={{ size: 'small', theme: 'grey' }}
                            digits={3}
                            value={transactionFee}
                            unit="gwei"
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
