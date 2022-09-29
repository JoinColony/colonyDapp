import React, { useEffect } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { AddressZero } from 'ethers/constants';
import classnames from 'classnames';
import { useField } from 'formik';

import Input, { MaxButtonParams } from '~core/Fields/Input';
import TokenSymbolSelector from '~core/Fields/TokenSymbolSelector';

import { ColonySafe } from '~data/generated';
import {
  BINANCE_NETWORK,
  DEFAULT_TOKEN_DECIMALS,
  ETHEREUM_NETWORK,
  SAFE_NETWORKS,
} from '~constants';
import { AnyToken } from '~data/index';

import styles from '~core/Fields/AmountTokens/AmountTokens.css';

export interface SafeBalance {
  balance: number;
  tokenAddress: string | null;
  token: AnyToken | null;
}

interface Props {
  safeBalances: SafeBalance[];
  disabledInput: boolean;
  selectedSafe: ColonySafe | undefined;
  transactionFormIndex: number;
  customAmountError?: MessageDescriptor | string;
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
  customAmountError,
  selectedSafe,
  safeBalances,
  disabledInput,
  transactionFormIndex,
  maxButtonParams,
}: Props) => {
  const [, { value: tokenAddress }, { setValue: setTokenAddress }] = useField(
    `transactions.${transactionFormIndex}.tokenAddress`,
  );
  const [, , { setValue: setTokenDecimals }] = useField(
    `transactions.${transactionFormIndex}.tokenDecimals`,
  );

  const tokens: AnyToken[] = safeBalances.map((balance) => {
    // If selected safe balance uses an ERC20 token
    if (balance.token && balance.tokenAddress) {
      return {
        ...balance.token,
        address: balance.tokenAddress,
      };
    }
    // Otherwise retrieve the safe chain's native token
    const safeNetworkData = SAFE_NETWORKS.find(
      (network) => Number(selectedSafe?.chainId) === network.chainId,
    );
    const getNetworkName = () => {
      if (safeNetworkData?.chainId === BINANCE_NETWORK.chainId) {
        return 'binance';
      }
      return (
        safeNetworkData?.name.toLowerCase() ||
        ETHEREUM_NETWORK.name.toLowerCase()
      );
    };

    return {
      ...(safeNetworkData?.nativeToken || ETHEREUM_NETWORK.nativeToken),
      address: AddressZero,
      networkName: getNetworkName(),
    };
  });
  const selectedTokenInfo = tokens.find(
    (token) => token.address === tokenAddress,
  );

  useEffect(() => {
    if (!tokenAddress && tokens[0]) {
      setTokenAddress(tokens[0].address);
    }
  }, [tokenAddress, tokens, setTokenAddress]);

  return (
    <div className={styles.tokenAmount}>
      <div
        className={classnames(styles.tokenAmountInputContainer, {
          [styles.inputContainerMaxButton]: !!maxButtonParams,
        })}
      >
        <Input
          label={MSG.amount}
          name={`transactions.${transactionFormIndex}.amount`}
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
            name={`transactions.${transactionFormIndex}.tokenAddress`}
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabledInput}
            onChange={(value) => {
              const selectedToken = tokens.find(
                (token) => token.address === value,
              );
              setTokenDecimals(selectedToken?.decimals);
            }}
          />
        </div>
      </div>
    </div>
  );
};

AmountBalances.displayName = displayName;

export default AmountBalances;
