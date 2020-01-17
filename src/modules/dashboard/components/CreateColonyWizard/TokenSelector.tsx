import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import { useApolloClient } from '@apollo/react-hooks';
import { isAddress } from 'web3-utils';

import { usePrevious } from '~utils/hooks';
import { Input } from '~core/Fields';
import Button from '~core/Button';
import { log } from '~utils/debug';
import { TokenQuery, TokenQueryVariables, TokenDocument } from '~data/index';

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

type Token = TokenQuery['token'];

interface Props {
  tokenAddress: string;
  onTokenSelect: (arg0: Token | null | void) => any;
  tokenData: Token;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
}

const getStatusText = (isLoading: boolean, tokenData?: Token) => {
  if (isLoading) {
    return { status: MSG.statusLoading };
  }
  if (tokenData === null) {
    return { status: MSG.statusNotFound };
  }
  return tokenData
    ? { status: MSG.preview, statusValues: tokenData.details }
    : { status: MSG.hint };
};

const displayName = 'dashboard.CreateColonyWizard.TokenSelector';

const TokenSelector = ({
  tokenAddress,
  onTokenSelect,
  tokenData,
  extra,
}: Props) => {
  const apolloClient = useApolloClient();
  const getToken = useCallback(async () => {
    const { data } = await apolloClient.query<TokenQuery, TokenQueryVariables>({
      query: TokenDocument,
      variables: { address: tokenAddress },
    });
    return data && data.token;
  }, [apolloClient, tokenAddress]);

  const [isLoading, setLoading] = useState(false);

  const handleGetTokenSuccess = useCallback(
    (token: Token) => {
      const {
        details: { name, symbol },
      } = token;
      setLoading(false);
      if (!name || !symbol) {
        onTokenSelect(null);
        return;
      }
      onTokenSelect(token);
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
    getToken()
      .then((token: Token) => handleGetTokenSuccess(token))
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
        {...getStatusText(isLoading, tokenData)}
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
