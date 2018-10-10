/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { compose, withHandlers, withProps, withState } from 'recompose';

import type { TokenType } from '~types/token';

import Button from '~core/Button';
import CardList from '~core/CardList';
import Heading from '~core/Heading';

import { sortObjectsBy } from '~utils/arrays';

import styles from './Tokens.css';

import EditTokensModal from './EditTokensModal.jsx';
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
  isEditingTokens: boolean,
  openEditTokensModal: () => void,
  closeEditTokensModal: () => void,
  toggleEditTokensModal: (current: boolean) => void,
};

const isEthSort = (prev: string, next: string): number => {
  const prevVal = prev.toLowerCase();
  const nextVal = next.toLowerCase();
  if (prevVal === 'eth' || nextVal === 'eth') {
    return prevVal === 'eth' ? -1 : 1;
  }
  return 0;
};

const displayName = 'admin.Tokens';

const Tokens = ({
  tokens = [],
  isEditingTokens,
  openEditTokensModal,
}: Props) => {
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
            {tokens.map(token => (
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
                onClick={openEditTokensModal}
              />
              <EditTokensModal isOpen={isEditingTokens} tokens={tokens} />
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
};

Tokens.displayName = displayName;

const enhance = compose(
  withState('isEditingTokens', 'setIsEditingTokens', false),
  withHandlers({
    openEditTokensModal: ({ setIsEditingTokens }) => () =>
      setIsEditingTokens(true),
    closeEditTokensModal: ({ setIsEditingTokens }) => () =>
      setIsEditingTokens(false),
    toggleEditTokensModal: ({ setIsEditingTokens }) => () =>
      setIsEditingTokens(current => !current),
  }),
  withProps(() => ({
    tokens: mockTokens.sort(
      sortObjectsBy(
        'isNative',
        { name: 'tokenSymbol', compareFn: isEthSort },
        'id',
      ),
    ),
  })),
);

export default enhance(Tokens);
