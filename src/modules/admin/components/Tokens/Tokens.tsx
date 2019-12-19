import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { compose } from 'recompose';
import sortBy from 'lodash/sortBy';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROLES } from '~constants';
import { DialogType } from '~core/Dialog';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { Address, DomainsMapType } from '~types/index';
import { useTransformer } from '~utils/hooks';
import { useLoggedInUser, useColonyTokensQuery } from '~data/index';

import { getLegacyRoles } from '../../../transformers';
import { userHasRole } from '../../../users/checks';
import { canEditTokens } from '../../checks';
import FundingBanner from './FundingBanner';
import TokenList from './TokenList';

import styles from './Tokens.css';

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
  intl: IntlShape;
  openDialog: (dialogName: string, dialogProps?: object) => DialogType;
  rootRoles: ROLES[];
}

const Tokens = ({
  canMintNativeToken,
  colonyAddress,
  domains,
  intl: { formatMessage },
  openDialog,
  rootRoles,
}: Props) => {
  const [selectedDomain, setSelectedDomain] = useState(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const { walletAddress } = useLoggedInUser();

  const oldUserRoles = useTransformer(getLegacyRoles, [domains]);
  const canEdit = canEditTokens(oldUserRoles, walletAddress);
  const canMoveTokens = userHasRole(rootRoles, ROLES.FUNDING);

  const domainsArray = useMemo(
    () => [
      { value: COLONY_TOTAL_BALANCE_DOMAIN_ID, label: { id: 'domain.all' } },
      ...sortBy(
        Object.entries(domains || {})
          .sort()
          .map(([domainId, { name }]) => ({
            label: name,
            value: domainId,
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

  const { data: colonyTokensData } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });
  const tokens = (colonyTokensData && colonyTokensData.colony.tokens) || [];
  const nativeTokenAddress =
    colonyTokensData && colonyTokensData.colony.nativeTokenAddress;
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
              appearance={{ alignOptions: 'right', theme: 'alt' }}
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

const enhance = compose(
  withDialog(),
  injectIntl,
) as any;

export default enhance(Tokens);
