import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { FormikProps } from 'formik';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { ActionForm, Input, InputStatus } from '~core/Fields';
import Numeral from '~core/Numeral';
import Button from '~core/Button';
import EthUsd from '~core/EthUsd';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { DEFAULT_NETWORK_TOKEN } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { getMainClasses } from '~utils/css';
import { mapPayload } from '~utils/actions';

import styles from './BuyTokens.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.BuyTokens.title',
    defaultMessage: `Buy {tokenSymbol}`,
  },
  helpTooltip: {
    id: 'dashboard.CoinMachine.BuyTokens.helpTooltip',
    defaultMessage: `This is where you buy tokens. You put how much you want in the amount field and click the big green buy button. It’s really quite self explanatory.`,
  },
  amountLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.amountLabel',
    defaultMessage: 'Amount',
  },
  userBalanceLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.userBalanceLabel',
    defaultMessage: 'Balance {amount}',
  },
  maxBalanceLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.maxBalanceLabel',
    defaultMessage: 'Max',
  },
  priceLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.priceLabel',
    defaultMessage: 'Price',
  },
  constLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.priceLabel',
    defaultMessage: 'Cost',
  },
  buyLabel: {
    id: 'dashboard.CoinMachine.BuyTokens.buyLabel',
    defaultMessage: 'Buy',
  },
});

type Props = {
  colony: Colony;
  /*
   * @NOTE This acts like an indicator that the sale is not currently active
   */
  disabled?: boolean;
};

interface FormValues {
  amount: string;
}

const displayName = 'dashboard.CoinMachine.BuyTokens';

const validationSchema = (userBalance: number) =>
  yup.object().shape({
    amount: yup.number().moreThan(0).max(userBalance),
  });

const BuyTokens = ({
  colony: { nativeTokenAddress, tokens, colonyAddress },
  disabled,
}: Props) => {
  const { username, ethereal, balance } = useLoggedInUser();

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const globalDisable = disabled || !username || ethereal;

  const handleInputFocus = useCallback(
    ({ amount }, setFieldValue) => {
      if (!globalDisable && amount === '0') {
        setFieldValue('amount', '');
      }
    },
    [globalDisable],
  );
  const handleInputBlur = useCallback(
    ({ amount }, resetForm, setFieldError) => {
      if (!globalDisable && !amount) {
        resetForm();
        setFieldError('amount', false);
      }
    },
    [globalDisable],
  );
  /*
   * @TODO This should be either
   * - the max tokens available in the sale (if you have enough ETH/XDAI to cover them)
   * - the max ETH/XDAI you have in the wallet (if there are more tokens in the sale than you can cover)
   */
  const handleSetMaxAmount = useCallback(
    (event, setFieldValue) => {
      if (!globalDisable) {
        event.preventDefault();
        event.stopPropagation();
        setFieldValue(
          'amount',
          `${parseInt(balance, 10)}.${balance.substr(
            balance.indexOf('.') + 1,
            2,
          )}`,
        );
      }
    },
    [globalDisable, balance],
  );

  const transform = useCallback(
    mapPayload(({ amount }) => ({
      colonyAddress,
      amount,
      decimals: nativeToken?.decimals,
    })),
    [],
  );

  return (
    <div
      className={getMainClasses({}, styles, {
        disabled: globalDisable,
      })}
    >
      <Heading
        appearance={{
          margin: 'none',
          size: 'medium',
          weight: 'bold',
          theme: 'dark',
        }}
        text={MSG.title}
        textValues={{ tokenSymbol: nativeToken?.symbol }}
      />
      <QuestionMarkTooltip
        tooltipText={MSG.helpTooltip}
        className={styles.help}
        tooltipPopperProps={{
          placement: 'top',
        }}
        tooltipClassName={styles.tooltip}
      />
      <ActionForm
        initialValues={{
          amount: '0',
        }}
        validationSchema={validationSchema(parseFloat(balance))}
        submit={ActionTypes.COIN_MACHINE_BUY_TOKENS}
        error={ActionTypes.COIN_MACHINE_BUY_TOKENS_ERROR}
        success={ActionTypes.COIN_MACHINE_BUY_TOKENS_SUCCESS}
        transform={transform}
      >
        {({
          values,
          setFieldValue,
          isSubmitting,
          handleSubmit,
          isValid,
          errors,
          resetForm,
          setFieldError,
        }: FormikProps<FormValues>) => (
          <div>
            <div className={styles.inputContainer}>
              <div
                className={styles.inputComponent}
                onClick={() => handleInputFocus(values, setFieldValue)}
                onBlur={() => handleInputBlur(values, resetForm, setFieldError)}
                aria-hidden="true"
              >
                <Input
                  appearance={{ theme: 'minimal' }}
                  formattingOptions={{
                    numeral: true,
                    numeralPositiveOnly: true,
                    numeralDecimalScale: getTokenDecimalsWithFallback(
                      nativeToken?.decimals,
                    ),
                  }}
                  label={MSG.amountLabel}
                  name="amount"
                  disabled={globalDisable}
                  elementOnly
                />
                {errors?.amount && (
                  <div className={styles.fieldError}>
                    <InputStatus error={errors.amount} />
                  </div>
                )}
                {!globalDisable && (
                  <div className={styles.userBalance}>
                    <span>
                      <FormattedMessage
                        {...MSG.userBalanceLabel}
                        values={{
                          amount: (
                            <Numeral
                              value={balance}
                              truncate={2}
                              suffix={` ${DEFAULT_NETWORK_TOKEN.symbol}`}
                            />
                          ),
                        }}
                      />
                    </span>
                    <Button
                      text={MSG.maxBalanceLabel}
                      appearance={{ size: 'small', theme: 'blue' }}
                      onClick={(event) =>
                        handleSetMaxAmount(event, setFieldValue)
                      }
                    />
                  </div>
                )}
              </div>
              <span
                className={styles.nativeToken}
                title={nativeToken?.name || undefined}
              >
                {nativeToken?.symbol}
              </span>
            </div>
            <div className={styles.amountsContainer}>
              <div className={styles.amounts}>
                <div className={styles.amountsLabel}>
                  <FormattedMessage {...MSG.priceLabel} />
                </div>
                <div className={styles.amountsValues}>
                  {/*
                   * @TODO Get actual sale price
                   */}
                  <div>{!disabled ? 0.0001 : 'N/A'}</div>
                  <div>
                    <EthUsd
                      appearance={{ theme: 'grey', size: 'small' }}
                      value={
                        /*
                         * @NOTE Set value to 0 if amount is only the decimal point
                         * Just entering the decimal point will pass it through to EthUsd
                         * and that will try to fetch the balance for, which, obviously, will fail
                         *
                         * values.amount && values.amount !== '.' ? values.amount : '0'
                         *
                         * @TODO Get actual sale price
                         */
                        !disabled ? 0.0001 : 0
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.symbols}>
                {`${DEFAULT_NETWORK_TOKEN.symbol}/${nativeToken?.symbol}`}
              </div>
            </div>
            <div className={styles.amountsContainer}>
              <div className={styles.amounts}>
                <div className={styles.amountsLabel}>
                  <FormattedMessage {...MSG.constLabel} />
                </div>
                <div className={styles.amountsValues}>
                  {/*
                   * @TODO Get actual sale price
                   */}
                  {!disabled ? (
                    <div>
                      {values.amount
                        ? (parseInt(values.amount, 10) * 0.0001).toFixed(4)
                        : ''}
                    </div>
                  ) : (
                    <div>N/A</div>
                  )}
                  <div>
                    <EthUsd
                      appearance={{ theme: 'grey', size: 'small' }}
                      value={
                        /*
                         * @NOTE Set value to 0 if amount is only the decimal point
                         * Just entering the decimal point will pass it through to EthUsd
                         * and that will try to fetch the balance for, which, obviously, will fail
                         *
                         * values.amount && values.amount !== '.' ? values.amount : '0'
                         *
                         * @TODO Get actual sale price
                         */
                        values.amount
                          ? parseInt(values.amount, 10) * 0.0001
                          : '0'
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.symbols}>
                {`${DEFAULT_NETWORK_TOKEN.symbol}`}
              </div>
            </div>
            <div className={styles.controls}>
              <Button
                type="submit"
                text={MSG.buyLabel}
                appearance={{ theme: 'primary', size: 'large' }}
                onClick={() => handleSubmit()}
                loading={isSubmitting}
                disabled={
                  globalDisable || !isValid || parseFloat(values.amount) <= 0
                }
              />
            </div>
          </div>
        )}
      </ActionForm>
    </div>
  );
};

BuyTokens.displayName = displayName;

export default BuyTokens;
