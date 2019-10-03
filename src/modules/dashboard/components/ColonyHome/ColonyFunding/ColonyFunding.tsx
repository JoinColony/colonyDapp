import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { DialogType } from '~core/Dialog';
import withDialog from '~core/Dialog/withDialog';
import Heading from '~core/Heading';
import { Address } from '~types/index';
import { useSelector, useRoles } from '~utils/hooks';

import TokenItem from './TokenItem';
import { useColonyTokens } from '../../../hooks/useColonyTokens';
import { canMoveTokens as canMoveTokensCheck } from '../../../../admin/checks';
import { currentUserSelector } from '../../../../users/selectors';

import styles from './ColonyFunding.css';

const MSG = defineMessages({
  buttonFund: {
    id: 'dashboard.ColonyHome.ColonyFunding.buttonFund',
    defaultMessage: 'Fund',
  },
  title: {
    id: 'dashboard.ColonyHome.ColonyFunding.title',
    defaultMessage: 'Available Funding',
  },
});

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

  const {
    profile: { walletAddress: currentUserWalletAddress },
  } = useSelector(currentUserSelector);
  const { data: roles } = useRoles(colonyAddress);
  const canMoveTokens = useMemo(
    () => canMoveTokensCheck(roles, currentUserWalletAddress),
    [currentUserWalletAddress, roles],
  );

  const handleMoveTokens = useCallback(
    () =>
      openDialog('TokensMoveDialog', {
        colonyAddress,
        toDomain: currentDomainId,
      }),
    [openDialog, colonyAddress, currentDomainId],
  );

  // hide for root domain
  return currentDomainId === 0 ? null : (
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
