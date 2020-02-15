import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import InfoPopover from '~core/InfoPopover';
import { TokensMoveDialog } from '~admin/Tokens';
import { DomainsMapType } from '~types/index';
import {
  useLoggedInUser,
  FullColonyFragment,
  useTokenBalancesForDomainsQuery,
} from '~data/index';

import { canMoveTokens as canMoveTokensCheck } from '../../../../admin/checks';
import TokenItem from './TokenItem';

import styles from './ColonyFunding.css';
import { SpinnerLoader } from '~core/Preloaders';

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
  colony: FullColonyFragment;
  currentDomainId: number;
  domains: DomainsMapType;
}

const displayName = 'dashboard.ColonyHome.ColonyFunding';

const ColonyFunding = ({ colony, currentDomainId, domains }: Props) => {
  const { walletAddress } = useLoggedInUser();
  const openDialog = useDialog(TokensMoveDialog);

  const canMoveTokens = useMemo(
    () => canMoveTokensCheck(domains, walletAddress),
    [walletAddress, domains],
  );

  const { colonyAddress, tokens: colonyTokens, nativeTokenAddress } = colony;

  const handleMoveTokens = useCallback(
    () =>
      openDialog({
        colonyAddress,
        toDomain:
          currentDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID
            ? currentDomainId
            : undefined,
      }),
    [openDialog, colonyAddress, currentDomainId],
  );

  const {
    data,
    loading: isLoadingTokenBalances,
  } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      domainIds: [currentDomainId],
      tokenAddresses: colonyTokens.map(({ address }) => address),
    },
  });

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
      {data && !isLoadingTokenBalances ? (
        <ul>
          {data.tokens.map(token => (
            <li key={token.address}>
              <InfoPopover
                token={token}
                isTokenNative={token.address === nativeTokenAddress}
              >
                <div className={styles.tokenBalance}>
                  <TokenItem currentDomainId={currentDomainId} token={token} />
                </div>
              </InfoPopover>
            </li>
          ))}
        </ul>
      ) : (
        <SpinnerLoader />
      )}
    </div>
  );
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
