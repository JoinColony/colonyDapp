import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { AddressZero } from 'ethers/constants';
import Maybe from 'graphql/tsutils/Maybe';
import moveDecimal from 'move-decimal-point';
import classnames from 'classnames';

import { bigNumberify } from 'ethers/utils';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { AnyToken, AnyTokens } from '~data/index';

import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import { FormValues as CreatePaymentFormValues } from '~dashboard/Dialogs/CreatePaymentDialog/CreatePaymentDialog';
import { FormValues as ControlSafeFormValues } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';

import Input, { MaxButtonParams } from '../Input';
import TokenSymbolSelector from '../TokenSymbolSelector';

import styles from './AmountTokens.css';

interface Props {
  networkFeeInverse: Maybe<string | undefined>;
  tokens: AnyTokens;
  disabledInput: boolean;
  values: CreatePaymentFormValues | ControlSafeFormValues;
  selectedToken?: AnyToken;
  customAmountError?: MessageDescriptor | string;
  inputName?: string;
  selectorName?: string;
  maxButtonParams?: MaxButtonParams;
}

const MSG = defineMessages({
  amount: {
    id: 'AmountTokens.amount',
    defaultMessage: 'Amount',
  },
  fee: {
    id: 'AmountTokens.fee',
    defaultMessage: 'Network fee: {fee} {symbol}',
  },
  token: {
    id: 'AmountTokens.address',
    defaultMessage: 'Token',
  },
});

const displayName = 'AmountTokens';

// NOTE: The equation to calculate totalToPay is as following (in Wei)
// totalToPay = (receivedAmount + 1) * (feeInverse / (feeInverse -1))
// The network adds 1 wei extra fee after the percentage calculation
// For more info check out
// https://github.com/JoinColony/colonyNetwork/blob/806e4d5750dc3a6b9fa80f6e007773b28327c90f/contracts/colony/ColonyFunding.sol#L656

export const calculateFee = (
  receivedAmount = '0', // amount that the recipient finally receives
  feeInverse: string,
  decimals: number,
): { feesInWei: string; totalToPay: string } => {
  const amountInWei = moveDecimal(receivedAmount, decimals);
  const totalToPayInWei = bigNumberify(amountInWei)
    .add(1)
    .mul(feeInverse)
    .div(bigNumberify(feeInverse).sub(1));
  const feesInWei = totalToPayInWei.sub(amountInWei);
  return {
    feesInWei: feesInWei.toString(),
    totalToPay: moveDecimal(totalToPayInWei, -1 * decimals),
  }; // NOTE: seems like moveDecimal does not have strict typing
};

const AmountTokens = ({
  values,
  networkFeeInverse,
  customAmountError,
  selectedToken,
  tokens,
  disabledInput,
  inputName,
  selectorName,
  maxButtonParams,
}: Props) => (
  <div className={styles.tokenAmount}>
    <div
      className={classnames(styles.tokenAmountInputContainer, {
        [styles.inputContainerMaxButton]: !!maxButtonParams,
      })}
    >
      <Input
        label={MSG.amount}
        name={inputName || 'amount'}
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
        maxButtonParams={maxButtonParams}
      />
      {networkFeeInverse &&
        customAmountError === undefined &&
        values[inputName || 'amount'] &&
        Number(values[inputName || 'amount']) > 0 && (
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
                        values[inputName || 'amount'],
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
          name={selectorName || 'tokenAddress'}
          elementOnly
          appearance={{ alignOptions: 'right', theme: 'grey' }}
          disabled={disabledInput}
        />
      </div>
      {values[inputName || 'amount'] === AddressZero && (
        <div className={styles.tokenAmountUsd}>
          <EthUsd
            appearance={{ theme: 'grey' }}
            value={
              /*
               * @NOTE Set value to 0 if amount is only the decimal point
               * Just entering the decimal point will pass it through to EthUsd
               * and that will try to fetch the balance for, which, obviously, will fail
               */
              values[inputName || 'amount'] &&
              values[inputName || 'amount'] !== '.'
                ? values[inputName || 'amount']
                : '0'
            }
          />
        </div>
      )}
    </div>
  </div>
);

AmountTokens.displayName = displayName;

export default AmountTokens;
