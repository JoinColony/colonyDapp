import React, { FC, useCallback, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import sortBy from 'lodash/sortBy';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROLES } from '~constants';
import { DialogType } from '~core/Dialog';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { Address, DomainsMapType } from '~types/index';
import { useTransformer } from '~utils/hooks';
import { useLoggedInUser, useTokenBalancesForDomainsQuery } from '~data/index';

import { getLegacyRoles } from '../../../transformers';
import { userHasRole } from '../../../users/checks';
import { canEditTokens } from '../../checks';
import FundingBanner from './FundingBanner';
import TokenList from './TokenList';

import styles from './Tokens.css';
import { ZERO_ADDRESS } from '~utils/web3/constants';

const MSG = defineMessages({
  labelSelectDomain: {
    id: 'dashboard.Tokens.labelSelectDomain',
    defaultMessage: 'Select a domain',
  },
  navItemMoveTokens: {
    id: 'dashboard.Tokens.navItemMoveTokens',
    defaultMessage: 'Move funds',
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
    defaultMessage: 'Tokens: {selectedDomainLabel}',
  },
});

interface InProps {
  canMintNativeToken?: boolean;
  colonyAddress: Address;
  domains: DomainsMapType;
  nativeTokenAddress: Address;
  rootRoles: ROLES[];
  tokenAddresses: string[];
}

interface Props extends InProps {
  openDialog: (dialogName: string, dialogProps?: object) => DialogType;
}

const Tokens = ({
  canMintNativeToken,
  colonyAddress,
  domains,
  nativeTokenAddress,
  openDialog,
  rootRoles,
  tokenAddresses,
}: Props) => {
  const { formatMessage } = useIntl();

  const [selectedDomain, setSelectedDomain] = useState<string>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
  );

  const { walletAddress } = useLoggedInUser();

  const oldUserRoles = useTransformer(getLegacyRoles, [domains]);
  const canEdit = canEditTokens(oldUserRoles, walletAddress);
  const canMoveTokens = userHasRole(rootRoles, ROLES.FUNDING);

  const domainsArray = useMemo(
    () => [
      {
        value: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
        label: { id: 'domain.all' },
      },
      ...sortBy(
        Object.entries(domains || {})
          .sort()
          .map(([domainId, { name }]) => ({
            label: name,
            value: domainId.toString(),
          })),
        ['value'],
      ),
    ],
    [domains],
  );

  const selectedDomainLabel: string = useMemo(() => {
    const { label = '' } =
      domainsArray.find(({ value }) => value === selectedDomain) || {};
    return typeof label === 'string' ? label : formatMessage(label);
  }, [domainsArray, formatMessage, selectedDomain]);

  const setFieldValue = useCallback((_, value) => setSelectedDomain(value), [
    setSelectedDomain,
  ]);

  const { data: colonyTokensData, loading } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      domainIds: [
        COLONY_TOTAL_BALANCE_DOMAIN_ID,
        ...Object.keys(domains || {}).map(domainId => parseInt(domainId, 10)),
      ],
      tokenAddresses: [ZERO_ADDRESS, ...tokenAddresses],
    },
  });

  const tokens = (colonyTokensData && colonyTokensData.tokens) || [];
  const nativeToken =
    tokens && tokens.find(({ address }) => address === nativeTokenAddress);

  const handleEditTokens = useCallback(
    () =>
      openDialog('ColonyTokenEditDialog', {
        colonyAddress,
        nativeTokenAddress,
        selectedTokens: tokens && tokens.map(({ address }) => address),
      }),
    [openDialog, colonyAddress, nativeTokenAddress, tokens],
  );
  const handleMintTokens = useCallback(
    () =>
      openDialog('TokenMintDialog', {
        nativeToken,
        colonyAddress,
      }),
    [openDialog, nativeToken, colonyAddress],
  );
  const handleMoveTokens = useCallback(
    () =>
      openDialog('TokensMoveDialog', {
        colonyAddress,
        toDomain: selectedDomain,
      }),
    [openDialog, colonyAddress, selectedDomain],
  );

  return (
    <div className={styles.main}>
      <main>
        <div className={styles.mainContent}>
          <div className={styles.titleContainer}>
            <Heading
              text={MSG.title}
              textValues={{ selectedDomainLabel }}
              appearance={{ size: 'medium', theme: 'dark' }}
            />
            <Select
              appearance={{
                alignOptions: 'right',
                width: 'strict',
                theme: 'alt',
              }}
              connect={false}
              elementOnly
              label={MSG.labelSelectDomain}
              name="selectDomain"
              options={domainsArray}
              form={{ setFieldValue }}
              $value={selectedDomain}
            />
          </div>
          {tokens && (
            <TokenList
              domainId={selectedDomain}
              isLoading={loading}
              tokens={tokens}
              appearance={{ numCols: '3' }}
            />
          )}
        </div>
        <div>
          <FundingBanner colonyAddress={colonyAddress} />
        </div>
      </main>
      <aside className={styles.sidebar}>
        <ul>
          {canMoveTokens && (
            <li>
              <Button
                text={MSG.navItemMoveTokens}
                appearance={{ theme: 'blue' }}
                onClick={handleMoveTokens}
              />
            </li>
          )}
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

export default withDialog()(Tokens) as FC<InProps>;
