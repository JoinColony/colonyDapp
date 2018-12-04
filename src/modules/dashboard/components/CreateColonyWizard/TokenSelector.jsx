/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { isAddress } from 'web3-utils';

import { Input } from '~core/Fields';
import Button from '~core/Button';
import { log } from '~utils/debug';

import styles from './StepSelectToken.css';

import {
  TOKEN_INFO_FETCH,
  TOKEN_INFO_FETCH_SUCCESS,
  TOKEN_INFO_FETCH_ERROR,
} from '../../actionTypes/colony';
import promiseListener from '../../../../createPromiseListener';

import type { AsyncFunction } from '../../../../createPromiseListener';

const MSG = defineMessages({
  inputLabel: {
    id: 'dashboard.CreateColonyWizard.TokenSelector.label',
    defaultMessage: 'Token Contact Address',
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

type Props = {
  tokenAddress: string,
  onTokenSelect: (TokenData | null | void) => any,
  tokenData: ?TokenData,
};

type State = {
  isLoading: boolean,
};

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

class TokenSelector extends Component<Props, State> {
  getToken: AsyncFunction<{ tokenAddress: string }, any>;

  static displayName = 'dashboard.CreateColonyWizard.TokenSelector';

  constructor(props: Props) {
    super(props);
    this.state = { isLoading: false };
    this.getToken = promiseListener.createAsyncFunction({
      start: TOKEN_INFO_FETCH,
      resolve: TOKEN_INFO_FETCH_SUCCESS,
      reject: TOKEN_INFO_FETCH_ERROR,
    });
  }

  componentDidUpdate({ tokenAddress: prevTokenAddress }: Props) {
    const { onTokenSelect, tokenAddress } = this.props;
    const { isLoading } = this.state;

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
    this.setLoading(true);
    onTokenSelect();

    // Get the token address and handle success/error
    this.getToken
      .asyncFunction({ tokenAddress })
      .then((...args) => this.handleGetTokenSuccess(...args))
      .catch(error => this.handleGetTokenError(error));
  }

  componentWillUnmount() {
    this.getToken.unsubscribe();
  }

  setLoading(isLoading: boolean) {
    this.setState({ isLoading });
  }

  handleGetTokenSuccess({ name, symbol }: TokenData) {
    const { onTokenSelect } = this.props;
    this.setLoading(false);
    if (!name || !symbol) {
      onTokenSelect(null);
      return;
    }
    onTokenSelect({ name, symbol });
  }

  handleGetTokenError(error: Error) {
    const { onTokenSelect } = this.props;
    this.setLoading(false);
    onTokenSelect(null);
    log(error);
  }

  render() {
    const { tokenData } = this.props;
    const { isLoading } = this.state;
    return (
      // TODO: I feel like this should be a custom input component at some point, that'd spare us a lot of hassle
      <div className={styles.main}>
        <Input
          name="tokenAddress"
          label={MSG.inputLabel}
          extra={<Button text={MSG.learnMore} appearance={{ theme: 'blue' }} />}
          {...getStatusText(tokenData, isLoading)}
        />
      </div>
    );
  }
}

export default TokenSelector;
