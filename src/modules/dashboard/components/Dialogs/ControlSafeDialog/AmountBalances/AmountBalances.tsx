import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
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
import { TransferFundsProps } from '../TransactionTypesSection/TransferFundsSection';

import styles from '~core/Fields/AmountTokens/AmountTokens.css';

export interface SafeBalance {
  balance: number;
  tokenAddress: string | null;
  token: AnyToken | null;
}

interface Props extends Pick<TransferFundsProps, 'handleValidation'> {
  safeBalances: SafeBalance[];
  disabledInput: boolean;
  selectedSafe: ColonySafe | undefined;
  transactionFormIndex: number;
  maxButtonParams: MaxButtonParams;
  handleChange: () => void;
}

const MSG = defineMessages({
  amount: {
    id: 'dashboard.ControlSafeDialog.AmountBalances.amount',
    defaultMessage: 'Amount',
  },
  token: {
    id: 'dashboard.ControlSafeDialog.AmountBalances.address',
    defaultMessage: 'Token',
  },
});

const displayName = 'dashboard.ControlSafeDialog.AmountBalances';

const AmountBalances = ({
  selectedSafe,
  safeBalances,
  disabledInput,
  transactionFormIndex,
  maxButtonParams,
  handleChange,
  handleValidation,
}: Props) => {
  const [
    ,
    { value: selectedTokenData },
    { setValue: setTokenData },
  ] = useField<AnyToken | null>(
    `transactions.${transactionFormIndex}.tokenData`,
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

  // Set token data in form state on initialisation
  useEffect(() => {
    setTokenData(tokens[0]);

    // initialisation only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedSafe) {
      handleValidation();
    }
  }, [selectedSafe, handleValidation]);

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
          onChange={handleChange}
          formattingOptions={{
            delimiter: ',',
            numeral: true,
            numeralPositiveOnly: true,
            numeralDecimalScale:
              selectedTokenData?.decimals || DEFAULT_TOKEN_DECIMALS,
          }}
          disabled={disabledInput}
          maxButtonParams={maxButtonParams}
        />
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={tokens}
            name={`transactions.${transactionFormIndex}.tokenData.address`}
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabledInput}
            onChange={(value) => {
              const selectedToken = tokens.find(
                (token) => token.address === value,
              );
              // can only select a token from "tokens"
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setTokenData(selectedToken!, false);
              handleValidation();
            }}
          />
        </div>
      </div>
    </div>
  );
};

AmountBalances.displayName = displayName;

export default AmountBalances;
