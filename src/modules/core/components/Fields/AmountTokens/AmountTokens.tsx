import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { AddressZero } from 'ethers/constants';
import Maybe from 'graphql/tsutils/Maybe';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { AnyToken, AnyTokens } from '~data/index';

import { calculateFee } from '~dashboard/Dialogs/CreatePaymentDialog/CreatePaymentDialogForm';

import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import { FormValues as CreatePaymentFormValues } from '~dashboard/Dialogs/CreatePaymentDialog/CreatePaymentDialog';
import { FormValues as GnosisControlSafeFormValues } from '~dashboard/Dialogs/GnosisControlSafeDialog/GnosisControlSafeDialog';

import Input from '../Input';
import TokenSymbolSelector from '../TokenSymbolSelector';

import styles from './AmountTokens.css';

interface Props {
  networkFeeInverse: Maybe<string | undefined>;
  tokens: AnyTokens;
  disabledInput: boolean;
  values: CreatePaymentFormValues | GnosisControlSafeFormValues;
  selectedToken?: AnyToken;
  customAmountError?: MessageDescriptor | string;
}

const MSG = defineMessages({
  amount: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.amount',
    defaultMessage: 'Amount',
  },
  fee: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.fee',
    defaultMessage: 'Network fee: {fee} {symbol}',
  },
  token: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.address',
    defaultMessage: 'Token',
  },
});

const displayName = 'Fields.AmountTokens';

const AmountTokens = ({
  values,
  networkFeeInverse,
  customAmountError,
  selectedToken,
  tokens,
  disabledInput,
}: Props) => {
  return (
    <div className={styles.tokenAmount}>
      <div className={styles.tokenAmountInputContainer}>
        <Input
          label={MSG.amount}
          name="amount"
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
          formattingOptions={{
            delimiter: ',',
            numeral: true,
            numeralDecimalScale: getTokenDecimalsWithFallback(
              selectedToken && selectedToken.decimals,
            ),
          }}
          disabled={disabledInput}
          /*
           * Force the input component into an error state
           * This is needed for our custom error state to work
           */
          forcedFieldError={customAmountError}
          dataTest="paymentAmountInput"
        />
        {networkFeeInverse &&
          values.amount &&
          values.amount !== '0' &&
          values.amount !== '0.' &&
          values.amount !== '.' && (
            <div className={styles.networkFee}>
              <FormattedMessage
                {...MSG.fee}
                values={{
                  fee: (
                    <Numeral
                      appearance={{
                        size: 'small',
                        theme: 'grey',
                      }}
                      value={
                        calculateFee(
                          values.amount,
                          networkFeeInverse,
                          getTokenDecimalsWithFallback(selectedToken?.decimals),
                        ).feesInWei
                      }
                      unit={getTokenDecimalsWithFallback(
                        selectedToken && selectedToken.decimals,
                      )}
                    />
                  ),
                  symbol: (selectedToken && selectedToken.symbol) || '???',
                }}
              />
            </div>
          )}
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={tokens}
            name="tokenAddress"
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabledInput}
          />
        </div>
        {values.tokenAddress === AddressZero && (
          <div className={styles.tokenAmountUsd}>
            <EthUsd
              appearance={{ theme: 'grey' }}
              value={
                /*
                 * @NOTE Set value to 0 if amount is only the decimal point
                 * Just entering the decimal point will pass it through to EthUsd
                 * and that will try to fetch the balance for, which, obviously, will fail
                 */
                values.amount && values.amount !== '.' ? values.amount : '0'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

AmountTokens.displayName = displayName;

export default AmountTokens;
