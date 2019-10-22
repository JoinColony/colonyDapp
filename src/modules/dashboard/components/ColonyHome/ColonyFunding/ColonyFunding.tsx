import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import { DialogType } from '~core/Dialog';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import { Address } from '~types/index';
import { useDataFetcher, useSelector } from '~utils/hooks';

import { domainsAndRolesFetcher } from '../../../fetchers';
import { useColonyTokens } from '../../../hooks/useColonyTokens';
import { walletAddressSelector } from '../../../../users/selectors';
import { canMoveTokens as canMoveTokensCheck } from '../../../../admin/checks';
import TokenItem from './TokenItem';

import styles from './ColonyFunding.css';

const MSG = defineMessages({
  buttonFund: {
    id: 'dashboard.ColonyHome.ColonyFunding.buttonFund',
    defaultMessage: 'Move Funds',
  },
  title: {
    id: 'dashboard.ColonyHome.ColonyFunding.title',
    defaultMessage: 'Available Funding',
  },
});

// SHOW button if user has COLONY_ROLE_FUNDING or ROOT in any domain

interface Props {
  colonyAddress: Address;
  currentDomainId: number;
  openDialog: (dialogName: string, dialogProps?: object) => DialogType;
}

const displayName = 'dashboard.ColonyHome.ColonyFunding';

const ColonyFunding = ({
  colonyAddress,
  currentDomainId,
  openDialog,
}: Props) => {
  const [tokenReferences, tokens] = useColonyTokens(colonyAddress);

  const walletAddress = useSelector(walletAddressSelector);

  const { data: domains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const canMoveTokens = useMemo(
    () => canMoveTokensCheck(domains, walletAddress),
    [walletAddress, domains],
  );

  const handleMoveTokens = useCallback(
    () =>
      openDialog('TokensMoveDialog', {
        colonyAddress,
        toDomain:
          currentDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID
            ? currentDomainId
            : undefined,
      }),
    [openDialog, colonyAddress, currentDomainId],
  );

  return (
    <div>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
        {canMoveTokens && (
          <span className={styles.fundingButton}>
            <Button
              appearance={{ theme: 'blue' }}
              onClick={handleMoveTokens}
              text={MSG.buttonFund}
            />
          </span>
        )}
      </Heading>
      <ul>
        {tokens &&
          tokenReferences &&
          tokens.map(token => (
            <TokenItem
              currentDomainId={currentDomainId}
              key={token.address}
              token={token}
              tokenReference={tokenReferences.find(
                ({ address }) => address === token.address,
              )}
            />
          ))}
      </ul>
    </div>
  );
};

ColonyFunding.displayName = displayName;

export default (withDialog() as any)(ColonyFunding);
