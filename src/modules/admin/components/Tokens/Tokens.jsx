/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMappedState } from 'redux-react-hook';

import type { DialogType } from '~core/Dialog';
import type { RolesType, TokenType } from '~immutable';
import type { Address } from '~types';

import Button from '~core/Button';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';

import { useDataFetcher } from '~utils/hooks';

import { rolesFetcher, tokenFetcher } from '../../../dashboard/fetchers';

import {
  colonyTokensSelector,
  colonyNativeTokenSelector,
} from '../../../dashboard/selectors';
import { walletAddressSelector } from '../../../users/selectors';

import { canEditTokens } from '../../checks';

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

type Props = {
  canMintNativeToken?: boolean,
  colonyAddress: Address,
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
};

const Tokens = ({ canMintNativeToken, colonyAddress, openDialog }: Props) => {
  // permissions checks
  const { data: roles } = useDataFetcher<RolesType>(
    rolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const walletAddress = useMappedState(walletAddressSelector);
  const canEdit = useMemo(() => canEditTokens(roles, walletAddress), [
    roles,
    walletAddress,
  ]);

  // get sorted tokens
  const mapColonyTokens = useCallback(
    state => colonyTokensSelector(state, colonyAddress),
    [colonyAddress],
  );
  const tokens = useMappedState(mapColonyTokens);

  // get the native token info from reference
  const mapColonyNativeToken = useCallback(
    state => colonyNativeTokenSelector(state, colonyAddress),
    [colonyAddress],
  );
  const nativeTokenReference = useMappedState(mapColonyNativeToken);
  const nativeTokenAddress = nativeTokenReference
    ? nativeTokenReference.address
    : '';
  const { data: nativeToken } = useDataFetcher<TokenType>(
    tokenFetcher,
    [nativeTokenAddress],
    [nativeTokenAddress],
  );

  // handle opening of dialogs
  const handleEditTokens = useCallback(
    () =>
      openDialog('ColonyTokenEditDialog', {
        selectedTokens: tokens && tokens.map(({ address }) => address),
        colonyAddress,
      }),
    [openDialog, tokens, colonyAddress],
  );
  const handleMintTokens = useCallback(
    () =>
      openDialog('TokenMintDialog', {
        nativeToken,
        colonyAddress,
      }),
    [openDialog, nativeToken, colonyAddress],
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
        <TokenList tokens={tokens} appearance={{ numCols: '3' }} />
      </main>
      <aside className={styles.sidebar}>
        <ul>
          {canMintNativeToken && (
            <li>
              <Button
                text={MSG.navItemMintNewTokens}
                appearance={{ theme: 'blue' }}
                onClick={handleMintTokens}
              />
            </li>
          )}
          {canEdit && (
            <li>
              <Button
                text={MSG.navItemEditTokens}
                appearance={{ theme: 'blue' }}
                onClick={handleEditTokens}
              />
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
};

Tokens.displayName = 'admin.Tokens';

export default withDialog()(Tokens);
