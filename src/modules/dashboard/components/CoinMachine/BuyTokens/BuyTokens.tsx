import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { FormikProps } from 'formik';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { ActionForm, Input } from '~core/Fields';
import Numeral from '~core/Numeral';
import Button from '~core/Button';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { DEFAULT_NETWORK_TOKEN } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { getMainClasses } from '~utils/css';

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
});

type Props = {
  colony: Colony;
  disabled?: boolean;
};

interface FormValues {
  amount: string;
}

const displayName = 'dashboard.CoinMachine.BuyTokens';

const validationSchema = yup.object().shape({
  mintAmount: yup.number().required().moreThan(0),
});

const BuyTokens = ({
  colony: { nativeTokenAddress, tokens },
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
    ({ amount }, setFieldValue) => {
      if (!globalDisable && !amount) {
        setFieldValue('amount', '0');
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
          `${parseInt(balance, 10)}.${balance.substr(balance.indexOf('.'), 3)}`,
        );
      }
    },
    [globalDisable, balance],
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
        validationSchema={validationSchema}
        submit={ActionTypes.COLONY_ACTION_GENERIC}
        error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
        success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      >
        {({ values, setFieldValue }: FormikProps<FormValues>) => (
          <div>
            <div className={styles.inputContainer}>
              <div
                className={styles.inputComponent}
                onClick={() => handleInputFocus(values, setFieldValue)}
                onBlur={() => handleInputBlur(values, setFieldValue)}
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
                />
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
          </div>
        )}
      </ActionForm>
    </div>
  );
};

BuyTokens.displayName = displayName;

export default BuyTokens;
