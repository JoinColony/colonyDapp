/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import type { DialogType } from '~core/Dialog';
import type {
  ContractTransactionType,
  TokenType,
  TokenReferenceType,
} from '~immutable';

import Button from '~core/Button';
import Heading from '~core/Heading';

import { useDataFetcher } from '~utils/hooks';

import {
  colonyTransactionsFetcher,
  colonyUnclaimedTransactionsFetcher,
} from '../../fetchers';

import { updateColonyTokens } from '../../actionCreators';

import TokenList from './TokenList.jsx';

import styles from './Tokens.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Tokens.title',
    defaultMessage: 'Token Balances',
  },
  nativeTokenText: {
    id: 'dashboard.Tokens.nativeTokenText',
    defaultMessage: '*Native token: {nativeToken}',
  },
  navItemMintNewTokens: {
    id: 'dashboard.Tokens.navItemMintNewTokens',
    defaultMessage: 'Mint New Tokens',
  },
  navItemEditTokens: {
    id: 'dashboard.Tokens.navItemEditTokens',
    defaultMessage: 'Edit Tokens',
  },
});

type Props = {|
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
  tokens: Array<TokenReferenceType>,
  ensName: string,
  nativeToken: TokenType,
|};

const handleEditTokens = (
  openDialog: *,
  dispatch: *,
  ensName: *,
  selectedTokens: *,
  transactions: *,
  unclaimedTransactions: *,
) => {
  // convert current tokens and transactions to array of addresses
  const potentialTokens = Object.values(
    [
      ...(selectedTokens || []),
      ...(transactions || []).map(({ token }) => ({ address: token })),
      ...(unclaimedTransactions || []).map(({ token }) => ({ address: token })),
    ].reduce((acc, token) => ({ ...acc, [token.address]: token }), {}),
  );

  openDialog('TokenEditDialog', {
    tokens: potentialTokens,
    selectedTokens:
      selectedTokens && selectedTokens.map(({ address }) => address),
  })
    .afterClosed()
    .then(({ tokens }) => {
      dispatch(updateColonyTokens(ensName, tokens));
    })
    .catch(() => {});
};

const handleMintTokens = (openDialog: *, dispatch: *, nativeToken: *) => {
  openDialog('TokenMintDialog', {
    nativeToken,
  })
    .afterClosed()
    .then(() => {
      // TODO: mint tokens
    })
    .catch(() => {
      // cancel actions here
    });
};

const Tokens = ({
  tokens = [],
  nativeToken: { symbol: nativeTokenSymbol } = {}, // TODO: fetch this from tokens
  ensName,
  openDialog,
}: Props) => {
  const nativeToken = tokens.find(token => token.isNative);
  const isColonyAdmin = true; // TODO determine this value. Will all users visiting this route be admins?
  const isUserColonyFounder = true; // TODO determine this value.
  const canMintNewTokens = true; // TODO determine this value. token generated at colony launch ? true : false;

  const { data: transactions } = useDataFetcher<ContractTransactionType[]>(
    colonyTransactionsFetcher,
    [ensName],
    [ensName],
  );

  const { data: unclaimedTransactions } = useDataFetcher<
    ContractTransactionType[],
  >(colonyUnclaimedTransactionsFetcher, [ensName], [ensName]);

  const dispatch = useDispatch();
  const editTokens = useCallback(
    () =>
      handleEditTokens(
        openDialog,
        dispatch,
        ensName,
        tokens,
        transactions,
        unclaimedTransactions,
      ),
    [
      openDialog,
      dispatch,
      ensName,
      tokens,
      transactions,
      unclaimedTransactions,
    ],
  );
  const mintTokens = useCallback(
    () => handleMintTokens(openDialog, dispatch, nativeToken),
    [openDialog, dispatch, nativeToken],
  );

  return (
    <div className={styles.main}>
      <main>
        <div className={styles.titleContainer}>
          <Heading
            text={MSG.title}
            appearance={{ size: 'medium', theme: 'dark' }}
          />
          {nativeToken && (
            <Heading appearance={{ size: 'normal' }}>
              <FormattedMessage
                {...MSG.nativeTokenText}
                values={{ nativeToken: nativeTokenSymbol }}
              />
            </Heading>
          )}
        </div>
        <TokenList tokens={tokens} appearance={{ numCols: '5' }} />
      </main>
      {isColonyAdmin && (
        <aside className={styles.sidebar}>
          <ul>
            {isUserColonyFounder && canMintNewTokens && (
              <li>
                <Button
                  text={MSG.navItemMintNewTokens}
                  appearance={{ theme: 'blue' }}
                  onClick={mintTokens}
                />
              </li>
            )}
            <li>
              <Button
                text={MSG.navItemEditTokens}
                appearance={{ theme: 'blue' }}
                onClick={editTokens}
              />
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
};

Tokens.displayName = 'admin.Tokens';

export default Tokens;
