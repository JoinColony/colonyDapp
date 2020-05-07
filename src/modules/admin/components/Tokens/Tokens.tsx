import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { ColonyRole } from '@colony/colony-js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';
import { Address, DomainsMapType } from '~types/index';
import { useTokenBalancesForDomainsQuery } from '~data/index';

import { userHasRole } from '../../../users/checks';
import FundingBanner from './FundingBanner';
import TokenList from './TokenList';
import ColonyTokenEditDialog from './ColonyTokenEditDialog';
import TokenMintDialog from './TokenMintDialog';
import TokensMoveDialog from './TokensMoveDialog';

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

interface Props {
  canMintNativeToken?: boolean;
  colonyAddress: Address;
  domains: DomainsMapType;
  nativeTokenAddress: Address;
  rootRoles: ColonyRole[];
  tokenAddresses: string[];
}

const Tokens = ({
  canMintNativeToken,
  colonyAddress,
  domains,
  nativeTokenAddress,
  rootRoles,
  tokenAddresses,
}: Props) => {
  const { formatMessage } = useIntl();

  const [selectedDomain, setSelectedDomain] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const openTokenEditDialog = useDialog(ColonyTokenEditDialog);
  const openTokenMintDialog = useDialog(TokenMintDialog);
  const openTokensMoveDialog = useDialog(TokensMoveDialog);

  const canEdit =
    userHasRole(rootRoles, ColonyRole.Root) ||
    userHasRole(rootRoles, ColonyRole.Administration);
  const canMoveTokens = userHasRole(rootRoles, ColonyRole.Funding);

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
      domainsArray.find(({ value }) => value === selectedDomain.toString()) ||
      {};
    return typeof label === 'string' ? label : formatMessage(label);
  }, [domainsArray, formatMessage, selectedDomain]);

  const setFieldValue = useCallback((value) => setSelectedDomain(value), [
    setSelectedDomain,
  ]);

  const { data: colonyTokensData, loading } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      domainIds: [
        COLONY_TOTAL_BALANCE_DOMAIN_ID,
        ...Object.keys(domains || {}).map((domainId) => parseInt(domainId, 10)),
      ],
      tokenAddresses: [ZERO_ADDRESS, ...tokenAddresses],
    },
  });

  const tokens = (colonyTokensData && colonyTokensData.tokens) || [];
  const nativeToken =
    tokens && tokens.find(({ address }) => address === nativeTokenAddress);

  const handleEditTokens = useCallback(
    () =>
      openTokenEditDialog({
        colonyAddress,
        nativeTokenAddress,
      }),
    [openTokenEditDialog, colonyAddress, nativeTokenAddress],
  );
  const handleMintTokens = useCallback(() => {
    if (nativeToken) {
      openTokenMintDialog({
        nativeToken,
        colonyAddress,
      });
    }
  }, [openTokenMintDialog, nativeToken, colonyAddress]);
  const handleMoveTokens = useCallback(
    () =>
      openTokensMoveDialog({
        colonyAddress,
        toDomain: selectedDomain,
      }),
    [colonyAddress, openTokensMoveDialog, selectedDomain],
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
            <Form
              initialValues={{
                selectDomain: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
              }}
              onSubmit={() => {}}
            >
              <Select
                appearance={{
                  alignOptions: 'right',
                  width: 'strict',
                  theme: 'alt',
                }}
                elementOnly
                label={MSG.labelSelectDomain}
                name="selectDomain"
                onChange={setFieldValue}
                options={domainsArray}
              />
            </Form>
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

export default Tokens;
