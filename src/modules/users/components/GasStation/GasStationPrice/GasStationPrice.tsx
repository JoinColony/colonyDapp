import { FormikProps } from 'formik';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'redux-react-hook';
import { BigNumber, bigNumberify, parseEther } from 'ethers/utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';
import * as yup from 'yup';

import { TransactionType, WalletKind } from '~immutable/index';
import { RadioOption } from '~core/Fields/RadioGroup';
import { getMainClasses } from '~utils/css';
import { withId } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { useSelector } from '~utils/hooks';
import { useLoggedInUser } from '~data/index';
import Alert from '~core/Alert';
import { IconButton } from '~core/Button';
import EthUsd from '~core/EthUsd';
import { ActionForm, RadioGroup } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import Duration from '~core/Duration';
import { SpinnerLoader } from '~core/Preloaders';
import { DEFAULT_NETWORK } from '~constants';

import { gasPrices as gasPricesSelector } from '../../../../core/selectors';
import {
  transactionEstimateGas,
  transactionUpdateGas,
} from '../../../../core/actionCreators';
import { walletKindSelector } from '../../../selectors';
import WalletInteraction from '../WalletInteraction';

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
  transactionSpeedTypeFixed: {
    id: 'users.GasStation.GasStationPrice.transactionSpeedTypeFixed',
    defaultMessage: 'Fixed',
  },
  inSufficientFundsNotification: {
    id: 'users.GasStation.GasStationFooter.insufficientFundsNotification',
    defaultMessage: `You do not have enough funds to complete this transaction.
      Add more XDAI to cover the transaction fee.`,
  },
});

interface Props {
  transaction: TransactionType;
}

type FormValues = {
  id: string;
  transactionSpeed: string;
};

let transactionSpeedOptions: RadioOption[] = [
  { value: 'suggested', label: MSG.transactionSpeedTypeSuggested },
  { value: 'cheaper', label: MSG.transactionSpeedTypeCheaper },
  { value: 'faster', label: MSG.transactionSpeedTypeFaster },
];

if (DEFAULT_NETWORK === 'xdai') {
  transactionSpeedOptions = [
    { value: 'fixed', label: MSG.transactionSpeedTypeFixed },
  ];
}

const validationSchema = yup.object().shape({
  transactionId: yup.string(),
  transactionSpeed: yup
    .string()
    .required()
    .oneOf(transactionSpeedOptions.map((speed) => speed.value)),
});

const displayName = 'users.GasStation.GasStationPrice';

const GasStationPrice = ({ transaction: { id, gasLimit, error } }: Props) => {
  const dispatch = useDispatch();

  const [speedMenuId] = useState(nanoid());
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  // @todo Actually determine whether the network is congested (gas station).
  const [isNetworkCongested] = useState(false);

  const gasPrices = useSelector(gasPricesSelector);
  const { balance } = useLoggedInUser();
  const walletKind = useSelector(walletKindSelector);

  const transform = useCallback(withId(id), [id]);
  const toggleSpeedMenu = useCallback(() => {
    setIsSpeedMenuOpen(!isSpeedMenuOpen);
  }, [isSpeedMenuOpen]);
  const updateGas = useCallback(
    (currentGasPrice: any) => {
      dispatch(transactionUpdateGas(id, { gasPrice: currentGasPrice }));
    },
    [dispatch, id],
  );
  const isBalanceLessThanTxFee = useCallback(
    (currentFeeInWei: BigNumber) => {
      // Check if the user can afford the transaction fee
      if (currentFeeInWei) {
        const balanceInWei = parseEther(balance);
        const enoughEth = currentFeeInWei.lte(balanceInWei);
        if (!enoughEth && !insufficientFunds) {
          setInsufficientFunds(true);
        }
      }
    },
    [balance, insufficientFunds],
  );

  useEffect(() => {
    dispatch(transactionEstimateGas(id));
  }, [dispatch, id]);

  const initialFormValues: FormValues = {
    id,
    transactionSpeed: transactionSpeedOptions[0].value,
  };
  return (
    <div className={getMainClasses({}, styles, { isSpeedMenuOpen })}>
      <ActionForm
        submit={ActionTypes.TRANSACTION_SEND}
        success={ActionTypes.TRANSACTION_SENT}
        error={ActionTypes.TRANSACTION_ERROR}
        validationSchema={validationSchema}
        initialValues={initialFormValues}
        transform={transform}
      >
        {({
          isSubmitting,
          isValid,
          values: { transactionSpeed },
        }: FormikProps<FormValues>) => {
          const currentGasPrice = gasPrices[transactionSpeed];
          const transactionFee =
            currentGasPrice &&
            gasLimit &&
            currentGasPrice.mul(bigNumberify(gasLimit));
          isBalanceLessThanTxFee(transactionFee);
          const waitTime = gasPrices[`${transactionSpeed}Wait`];
          return (
            <>
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
                    options={transactionSpeedOptions.map((option) => ({
                      ...option,
                      onClick: (e) => {
                        updateGas(gasPrices[e.target.value]);
                      },
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
                      onClick={toggleSpeedMenu}
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
                      <>
                        <Numeral
                          suffix=" XDAI"
                          unit="ether"
                          value={transactionFee}
                        />
                        <div className={styles.transactionFeeEthUsd}>
                          <EthUsd
                            appearance={{ size: 'small', theme: 'grey' }}
                            unit="ether"
                            value={transactionFee}
                          />
                        </div>
                      </>
                    ) : (
                      <SpinnerLoader />
                    )}
                  </div>
                  <div>
                    {error ? (
                      <IconButton type="submit" text={{ id: 'button.retry' }} />
                    ) : (
                      <IconButton
                        disabled={!isValid}
                        loading={!transactionFee || isSubmitting}
                        text={{ id: 'button.confirm' }}
                        type="submit"
                        data-test="gasStationConfirmTransaction"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </ActionForm>
      <div>
        <>
          {isNetworkCongested && <Alert text={MSG.networkCongestedWarning} />}
          {walletKind !== WalletKind.Software && (
            <WalletInteraction walletKind={walletKind} />
          )}
          {insufficientFunds && (
            <Alert
              appearance={{ theme: 'danger', size: 'small' }}
              text={MSG.inSufficientFundsNotification}
            />
          )}
        </>
      </div>
    </div>
  );
};

GasStationPrice.displayName = displayName;

export default GasStationPrice;
