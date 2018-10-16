/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TokenType } from '~types/token';

import Button from '~core/Button';
import CardList from '~core/CardList';
import Heading from '~core/Heading';

import styles from './Tokens.css';

import TokenCard from './TokenCard.jsx';

import mockTokens from './__datamocks__/mockTokens';

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

type Props = {
  tokens?: Array<TokenType>,
};

const sortTokens = (prevToken: TokenType, nextToken: TokenType): number => {
  /*
   *
   * Sort tokens by:
   *  1. native === true
   *  2. symbol === 'ETH'
   *  3. alphabetically thereafter
   *
   */
  if (prevToken.isNative || nextToken.isNative) {
    return prevToken.isNative ? -1 : 1;
  }

  const { tokenSymbol: prevSymbolRaw } = prevToken;
  const { tokenSymbol: nextSymbolRaw } = nextToken;
  const prevSymbol = prevSymbolRaw.toLowerCase();
  const nextSymbol = nextSymbolRaw.toLowerCase();

  if (prevSymbol === 'eth' || nextSymbol === 'eth') {
    return prevSymbol === 'eth' ? -1 : 1;
  }

  if (prevSymbol < nextSymbol) {
    return -1;
  }
  if (prevSymbol > nextSymbol) {
    return 1;
  }
  return 0;
};

const displayName = 'admin.Tokens';

const Tokens = ({ tokens = mockTokens }: Props) => {
  const nativeToken = tokens.find(token => token.isNative);
  const isColonyAdmin = true; // TODO determine this value. Will all users visiting this route be admins?
  const isUserColonyOwner = true; // TODO determine this value.
  const canMintNewTokens = true; // TODO determine this value. token generated at colony launch ? true : false;
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
                values={{ nativeToken: nativeToken.tokenSymbol }}
              />
            </Heading>
          )}
        </div>
        <div className={styles.tokenCardContainer}>
          <CardList>
            {tokens.sort(sortTokens).map(token => (
              <TokenCard key={token.id} token={token} />
            ))}
          </CardList>
        </div>
      </main>
      {isColonyAdmin && (
        <aside className={styles.sidebar}>
          <ul>
            {isUserColonyOwner &&
              canMintNewTokens && (
                <li>
                  <Button
                    text={MSG.navItemMintNewTokens}
                    appearance={{ theme: 'blue' }}
                  />
                </li>
              )}
            <li>
              <Button
                text={MSG.navItemEditTokens}
                appearance={{ theme: 'blue' }}
              />
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
};

Tokens.displayName = displayName;

export default Tokens;
