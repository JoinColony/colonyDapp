/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import type { DialogType } from '~core/Dialog';
import type { ContractTransactionType, TokenReferenceType } from '~immutable';

import Button from '~core/Button';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';

import { useDataFetcher } from '~utils/hooks';
import { sortObjectsBy } from '~utils/arrays';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { addressEquals } from '~utils/strings';

import { useToken } from '../../../dashboard/hooks';
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

const isEth = (a: TokenReferenceType, b: TokenReferenceType) => {
  if (addressEquals(a.address, ZERO_ADDRESS)) return -1;
  if (addressEquals(b.address, ZERO_ADDRESS)) return 1;
  return 0;
};

type Props = {
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
  tokens: {| [address: string]: TokenReferenceType |},
  ensName: string,
};

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

const Tokens = ({ tokens: tokensObject, ensName, openDialog }: Props) => {
  const isColonyAdmin = true; // TODO determine this value. Will all users visiting this route be admins?
  const isUserColonyFounder = true; // TODO determine this value.
  const canMintNewTokens = true; // TODO determine this value. token generated at colony launch ? true : false;

  const tokens = useMemo(
    () =>
      Object.keys(tokensObject)
        .map(key => tokensObject[key])
        .sort(isEth)
        .sort(sortObjectsBy('isNative')),
    [tokensObject],
  );

  const nativeTokenReference = useMemo(
    () => tokens.find(token => token.isNative) || {},
    [tokens],
  );
  const nativeToken = useToken(
    nativeTokenReference ? nativeTokenReference.address : '',
  );

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
    () => handleMintTokens(openDialog, dispatch, nativeTokenReference),
    [openDialog, dispatch, nativeTokenReference],
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
                values={{ nativeToken: nativeToken.symbol }}
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

export default withDialog()(Tokens);
