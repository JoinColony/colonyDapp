import React, { useEffect } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { AddressZero } from 'ethers/constants';
import classnames from 'classnames';
import { useField } from 'formik';

import EthUsd from '~core/EthUsd';
import Input, { MaxButtonParams } from '~core/Fields/Input';
import TokenSymbolSelector from '~core/Fields/TokenSymbolSelector';
import { FormValues as ControlSafeFormValues } from '~dashboard/Dialogs/ControlSafeDialog';

import { ColonySafe } from '~data/generated';
import {
  DEFAULT_TOKEN_DECIMALS,
  ETHEREUM_NETWORK,
  SAFE_NETWORKS,
} from '~constants';

import styles from '~core/Fields/AmountTokens/AmountTokens.css';

export interface SafeToken {
  name: string;
  decimals: number;
  symbol: string;
  address: string;
  networkName?: string;
  logoUri?: string;
}

export interface SafeBalance {
  balance: number;
  tokenAddress?: string;
  token?: SafeToken;
}

interface Props {
  safeBalances: SafeBalance[];
  disabledInput: boolean;
  values: ControlSafeFormValues;
  selectedSafe: ColonySafe | undefined;
  customAmountError?: MessageDescriptor | string;
  inputName?: string;
  selectorName?: string;
  maxButtonParams?: MaxButtonParams;
}

const MSG = defineMessages({
  amount: {
    id: 'AmountBalances.amount',
    defaultMessage: 'Amount',
  },
  token: {
    id: 'AmountBalances.address',
    defaultMessage: 'Token',
  },
});

const displayName = 'AmountBalances';

const AmountBalances = ({
  values,
  customAmountError,
  selectedSafe,
  safeBalances,
  disabledInput,
  inputName,
  selectorName,
  maxButtonParams,
}: Props) => {
  const [, { value: selectorValue }, { setValue }] = useField(
    selectorName || 'token',
  );
  const tokens: SafeToken[] = safeBalances.map((balance) => {
    if (balance.token && balance.tokenAddress) {
      return {
        ...balance.token,
        address: balance.tokenAddress,
      };
    }
    const currentNetworkData = SAFE_NETWORKS.find(
      (network) => Number(selectedSafe?.chainId) === network.chainId,
    );
    const getNetworkName = () => {
      switch (currentNetworkData?.chainId) {
        case 100:
          return 'xdai';
        case 43114:
          return 'avalanchec';
        case 56:
          return 'binance';
        default:
          return (
            currentNetworkData?.name.toLowerCase() ||
            ETHEREUM_NETWORK.name.toLowerCase()
          );
      }
    };

    return {
      ...(currentNetworkData?.nativeToken || ETHEREUM_NETWORK.nativeToken),
      address: AddressZero,
      networkName: getNetworkName(),
    };
  });
  const selectedTokenInfo = tokens.find(
    (token) => token.address === selectorValue,
  );

  useEffect(() => {
    if (!selectorValue && tokens[0]) {
      setValue(tokens[0]);
    }
  }, [selectorName, selectorValue, tokens, setValue]);

  return (
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
            numeralDecimalScale:
              selectedTokenInfo?.decimals || DEFAULT_TOKEN_DECIMALS,
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
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={tokens}
            name={selectorName || 'token'}
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabledInput}
            isSafeToken
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
};

AmountBalances.displayName = displayName;

export default AmountBalances;
