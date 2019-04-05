/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch, useMappedState } from 'redux-react-hook';
import BigNumber from 'bn.js';
import nanoid from 'nanoid';
import moveDecimal from 'move-decimal-point';

import type { DialogType } from '~core/Dialog';
import type {
  ContractTransactionType,
  RolesType,
  TokenReferenceType,
  TokenType,
} from '~immutable';

import Button from '~core/Button';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';

import { useDataFetcher } from '~utils/hooks';
import { sortObjectsBy } from '~utils/arrays';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { addressEquals } from '~utils/strings';

import {
  colonyTransactionsFetcher,
  colonyUnclaimedTransactionsFetcher,
} from '../../fetchers';
import { rolesFetcher, tokenFetcher } from '../../../dashboard/fetchers';

import { walletAddressSelector } from '../../../users/selectors';

import { updateColonyTokens, mintColonyTokens } from '../../actionCreators';

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

const handleEditTokens = ({
  openDialog,
  dispatch,
  ensName,
  selectedTokens,
  transactions,
  unclaimedTransactions,
}) => {
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

const handleMintTokens = ({
  openDialog,
  dispatch,
  nativeToken,
  nativeTokenReference,
  ensName,
}) => {
  openDialog('TokenMintDialog', {
    nativeToken: nativeTokenReference,
  })
    .afterClosed()
    .then(({ mintAmount }) => {
      // shift by the token's decimals (or default of 18)
      const amountNum = moveDecimal(
        mintAmount,
        nativeToken && nativeToken.decimals
          ? parseInt(nativeToken.decimals, 10)
          : 18,
      );
      const amount = new BigNumber(amountNum);

      dispatch(mintColonyTokens(ensName, amount, nanoid()));
    })
    .catch(() => {
      // cancel actions here
    });
};

const Tokens = ({ tokens: tokensObject, ensName, openDialog }: Props) => {
  const canMintNewTokens = true; // TODO fetch token `owner` and compare against colony/current user

  const walletAddress = useMappedState(walletAddressSelector);

  const { data: roles } = useDataFetcher<RolesType>(
    rolesFetcher,
    [ensName],
    [ensName],
  );
  const isColonyAdmin = useMemo(
    () =>
      roles &&
      !!roles.admins.find(admin => addressEquals(admin, walletAddress)),
    [roles, walletAddress],
  );
  const isColonyFounder = useMemo(
    () => roles && addressEquals(roles.founder, walletAddress),
    [roles, walletAddress],
  );

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
  const nativeTokenAddress = nativeTokenReference
    ? nativeTokenReference.address
    : '';
  const { data: nativeToken } = useDataFetcher<TokenType>(
    tokenFetcher,
    [nativeTokenAddress],
    [nativeTokenAddress],
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
      handleEditTokens({
        openDialog,
        dispatch,
        ensName,
        selectedTokens: tokens,
        transactions,
        unclaimedTransactions,
      }),
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
    () =>
      handleMintTokens({
        openDialog,
        dispatch,
        nativeToken,
        nativeTokenReference,
        ensName,
      }),
    [openDialog, dispatch, nativeToken, nativeTokenReference, ensName],
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
      {(isColonyAdmin || isColonyFounder) && (
        <aside className={styles.sidebar}>
          <ul>
            {isColonyFounder && canMintNewTokens && (
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
