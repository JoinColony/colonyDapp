/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { isAddress } from 'web3-utils';

import { useAsyncFunction, usePrevious } from '~utils/hooks';
import { Input } from '~core/Fields';
import Button from '~core/Button';
import { log } from '~utils/debug';
import { ACTIONS } from '~redux';

import type { Node } from 'react';
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

type TokenData = {
  name: string,
  symbol: string,
};

type Props = {|
  tokenAddress: string,
  onTokenSelect: (TokenData | null | void) => any,
  tokenData: ?TokenData,
  /** Extra node to render on the top right in the label */
  extra?: Node,
|};

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
    submit: ACTIONS.TOKEN_INFO_FETCH,
    success: ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
    error: ACTIONS.TOKEN_INFO_FETCH_ERROR,
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
      log(error);
    },
    [onTokenSelect],
  );

  const prevTokenAddress = usePrevious(tokenAddress);

  useEffect(
    () => {
      // Guard against updates that don't include a new, valid `tokenAddress`,
      // or if the form is submitting or loading.
      if (tokenAddress === prevTokenAddress || isLoading) return;
      if (!tokenAddress || !tokenAddress.length || !isAddress(tokenAddress)) {
        onTokenSelect();
        return;
      }
      // For a valid address, attempt to load token info.
      // XXX this is setting state during `componentDidUpdate`, which is
      // generally a bad idea, but we are guarding against it by checking the
      // state first.
      setLoading(true);
      onTokenSelect();

      // Get the token address and handle success/error
      getToken({ tokenAddress })
        .then((...args) => handleGetTokenSuccess(...args))
        .catch(error => handleGetTokenError(error));
    },
    [
      tokenAddress,
      getToken,
      isLoading,
      onTokenSelect,
      prevTokenAddress,
      handleGetTokenSuccess,
      handleGetTokenError,
    ],
  );

  return (
    // TODO: I feel like this should be a custom input component at some point, that'd spare us a lot of hassle
    <div className={styles.main}>
      <Input
        name="tokenAddress"
        label={MSG.inputLabel}
        extra={
          !extra ? (
            <Button text={MSG.learnMore} appearance={{ theme: 'blue' }} />
          ) : (
            extra
          )
        }
        {...getStatusText(tokenData, isLoading)}
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
