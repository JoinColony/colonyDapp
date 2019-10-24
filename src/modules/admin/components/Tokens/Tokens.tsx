import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, injectIntl, IntlShape } from 'react-intl';
import { compose } from 'recompose';

import { ROOT_DOMAIN, COLONY_TOTAL_BALANCE_DOMAIN_ID, ROLES } from '~constants';
import { DialogType } from '~core/Dialog';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { Address, DomainsMapType } from '~types/index';
import { useDataFetcher, useSelector, useTransformer } from '~utils/hooks';

import { getLegacyRoles, getUserRoles } from '../../../transformers';
import { tokenFetcher } from '../../../dashboard/fetchers';
import { useColonyNativeToken } from '../../../dashboard/hooks/useColonyNativeToken';
import { useColonyTokens } from '../../../dashboard/hooks/useColonyTokens';
import { walletAddressSelector } from '../../../users/selectors';
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
}

const Tokens = ({
  canMintNativeToken,
  colonyAddress,
  domains,
  intl: { formatMessage },
  openDialog,
}: Props) => {
  const [selectedDomain, setSelectedDomain] = useState(ROOT_DOMAIN);

  const walletAddress = useSelector(walletAddressSelector);

  const userRoles = useTransformer(getUserRoles, [
    domains,
    ROOT_DOMAIN,
    walletAddress,
  ]);

  const oldUserRoles = useTransformer(getLegacyRoles, [domains]);
  const canEdit = canEditTokens(oldUserRoles, walletAddress);
  const canMoveTokens = userHasRole(userRoles, ROLES.FUNDING);

  const domainsArray = useMemo(
    () => [
      { value: COLONY_TOTAL_BALANCE_DOMAIN_ID, label: { id: 'domain.all' } },
      ...Object.keys(domains || {})
        .sort()
        .map(domainId => ({
          label: domains[domainId].name,
          value: domains[domainId].id,
        })),
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

  // get sorted tokens
  const [tokens] = useColonyTokens(colonyAddress);

  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const nativeTokenAddress = nativeTokenReference
    ? nativeTokenReference.address
    : '';
  const { data: nativeToken } = useDataFetcher(
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
              options={domains}
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
