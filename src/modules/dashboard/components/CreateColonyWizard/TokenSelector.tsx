import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import { isAddress } from 'web3-utils';

import { useAsyncFunction, usePrevious } from '~utils/hooks';
import { Input } from '~core/Fields';
import Button from '~core/Button';
import { log } from '~utils/debug';
import { ActionTypes } from '~redux/index';
import styles from './StepSelectToken.css';

const MSG = defineMessages({
  inputLabel: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.label',
    defaultMessage: 'Token Address',
  },
  learnMore: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.learnMore',
    defaultMessage: 'Learn More',
  },
  hint: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.hint',
    defaultMessage: 'You can find them here: https://etherscan.io/tokens',
  },
  preview: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.preview',
    defaultMessage: 'Token Preview: {name} ({symbol})',
  },
  statusLoading: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.statusLoading',
    defaultMessage: 'Loading token data...',
  },
  statusNotFound: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.statusNotFound',
    defaultMessage: 'Token data not found. Please type in token details',
  },
});

interface TokenData {
  name: string;
  symbol: string;
}

interface Props {
  tokenAddress: string;
  onTokenSelect: (arg0: TokenData | null | void) => any;
  tokenData: TokenData | null;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
}

const getStatusText = (tokenData, isLoading) => {
  if (isLoading) {
    return { status: MSG.statusLoading };
  }
  if (tokenData === null) {
    return { status: MSG.statusNotFound };
  }
  return tokenData
    ? { status: MSG.preview, statusValues: tokenData }
    : { status: MSG.hint };
};

const displayName = 'dashboard.CreateColonyWizard.TokenSelector';

const TokenSelector = ({
  tokenAddress,
  onTokenSelect,
  tokenData,
  extra,
}: Props) => {
  const getToken = useAsyncFunction({
    submit: ActionTypes.TOKEN_INFO_FETCH,
    success: ActionTypes.TOKEN_INFO_FETCH_SUCCESS,
    error: ActionTypes.TOKEN_INFO_FETCH_ERROR,
  });

  const [isLoading, setLoading] = useState(false);

  const handleGetTokenSuccess = useCallback(
    ({ name, symbol }: TokenData) => {
      setLoading(false);
      if (!name || !symbol) {
        onTokenSelect(null);
        return;
      }
      onTokenSelect({ name, symbol });
    },
    [onTokenSelect],
  );

  const handleGetTokenError = useCallback(
    (error: Error) => {
      setLoading(false);
      onTokenSelect(null);
      log.error(error);
    },
    [onTokenSelect],
  );

  const prevTokenAddress = usePrevious(tokenAddress);

  useEffect(() => {
    // Guard against updates that don't include a new, valid `tokenAddress`,
    // or if the form is submitting or loading.
    if (tokenAddress === prevTokenAddress || isLoading) return;
    if (!tokenAddress || !tokenAddress.length || !isAddress(tokenAddress)) {
      onTokenSelect();
      return;
    }
    // For a valid address, attempt to load token info.
    // This is setting state during `componentDidUpdate`, which is
    // generally a bad idea, but we are guarding against it by checking the
    // state first.
    setLoading(true);
    onTokenSelect();

    // Get the token address and handle success/error
    getToken({ tokenAddress })
      .then((data: TokenData) => handleGetTokenSuccess(data))
      .catch(error => handleGetTokenError(error));
  }, [
    tokenAddress,
    getToken,
    isLoading,
    onTokenSelect,
    prevTokenAddress,
    handleGetTokenSuccess,
    handleGetTokenError,
  ]);

  return (
    /**
     * @todo Define custom input component for token addresses
     */
    <div className={styles.main}>
      <Input
        name="tokenAddress"
        label={MSG.inputLabel}
        extra={
          extra || (
            <Button text={MSG.learnMore} appearance={{ theme: 'blue' }} />
          )
        }
        {...getStatusText(tokenData, isLoading)}
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
