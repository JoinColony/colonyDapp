import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useMappedState } from 'redux-react-hook';

import { DialogType } from '~core/Dialog';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import { DomainType, TokenType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataFetcher, useOldRoles } from '~utils/hooks';

import { domainsFetcher, tokenFetcher } from '../../../dashboard/fetchers';
import { useColonyNativeToken } from '../../../dashboard/hooks/useColonyNativeToken';
import { useColonyTokens } from '../../../dashboard/hooks/useColonyTokens';
import { walletAddressSelector } from '../../../users/selectors';
import { canEditTokens } from '../../checks';
import TokenList from './TokenList';

import styles from './Tokens.css';

const MSG = defineMessages({
  labelSelectDomain: {
    id: 'dashboard.Tokens.labelSelectDomain',
    defaultMessage: 'Select a domain',
  },
  nativeTokenText: {
    id: 'dashboard.Tokens.nativeTokenText',
    defaultMessage: '*Native token: {nativeToken}',
  },
  navItemMintNewTokens: {
    id: 'dashboard.Tokens.navItemMintNewTokens',
    defaultMessage: 'Mint New tokens',
  },
  navItemEditTokens: {
    id: 'dashboard.Tokens.navItemEditTokens',
    defaultMessage: 'Edit tokens',
  },
  title: {
    id: 'dashboard.Tokens.title',
    defaultMessage: 'Token Balances',
  },
});

interface Props {
  canMintNativeToken?: boolean;
  colonyAddress: Address;
  openDialog: (dialogName: string, dialogProps?: object) => DialogType;
}

const Tokens = ({ canMintNativeToken, colonyAddress, openDialog }: Props) => {
  // permissions checks
  const { data: roles } = useOldRoles(colonyAddress);
  const walletAddress = useMappedState(walletAddressSelector);
  const canEdit = useMemo(() => canEditTokens(roles, walletAddress), [
    roles,
    walletAddress,
  ]);

  // domains
  const [selectedDomain, setSelectedDomain] = useState(1);
  const { data: domainsData, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[]
  >(domainsFetcher, [colonyAddress], [colonyAddress]);
  const domains = useMemo(
    () => [
      { value: 1, label: 'root' },
      ...(domainsData || []).map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    ],
    [domainsData],
  );

  const setFieldValue = useCallback((_, value) => setSelectedDomain(value), [
    setSelectedDomain,
  ]);

  // get sorted tokens
  const [tokens] = useColonyTokens(colonyAddress);

  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const nativeTokenAddress = nativeTokenReference
    ? nativeTokenReference.address
    : '';
  const { data: nativeToken } = useDataFetcher<TokenType>(
    tokenFetcher,
    [nativeTokenAddress],
    [nativeTokenAddress],
    // eslint-disable-next-line prettier/prettier
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
          {isFetchingDomains ? (
            <SpinnerLoader />
          ) : (
            <Select
              appearance={{ alignOptions: 'right', theme: 'alt' }}
              connect={false}
              elementOnly
              label={MSG.labelSelectDomain}
              name="selectDomain"
              options={domains}
              form={{ setFieldValue }}
              $value={selectedDomain}
            />
          )}
        </div>
        {tokens && (
          <TokenList
            domainId={selectedDomain}
            tokens={tokens}
            appearance={{ numCols: '3' }}
          />
        )}
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

export default (withDialog() as any)(Tokens);
