import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyVersion } from '@colony/colony-js';

import { SpinnerLoader } from '~core/Preloaders';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import InfoPopover from '~core/InfoPopover';

import TransferFundsDialog from '~dashboard/TransferFundsDialog';
import {
  useLoggedInUser,
  Colony,
  useTokenBalancesForDomainsQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';
import { canFund } from '../../../../users/checks';
import { getAllUserRoles } from '../../../../transformers';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ALLOWED_NETWORKS } from '~constants';

import TokenItem from './TokenItem';

import styles from './ColonyFunding.css';

const MSG = defineMessages({
  buttonFund: {
    id: 'dashboard.ColonyHome.ColonyFunding.buttonFund',
    defaultMessage: 'Move Funds',
  },
  title: {
    id: 'dashboard.ColonyHome.ColonyFunding.title',
    defaultMessage: 'Available funds',
  },
});

// SHOW button if user has COLONY_ROLE_FUNDING or ROOT in any domain

interface Props {
  colony: Colony;
  currentDomainId: number;
}

const displayName = 'dashboard.ColonyHome.ColonyFunding';

const ColonyFunding = ({ colony, currentDomainId }: Props) => {
  const { walletAddress, networkId, ethereal, username } = useLoggedInUser();
  const openDialog = useDialog(TransferFundsDialog);

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const canMoveFunds = !!username && !ethereal && canFund(allUserRoles);

  const {
    colonyAddress,
    tokens: colonyTokens,
    nativeTokenAddress,
    isDeploymentFinished,
  } = colony;

  const handleMoveTokens = useCallback(
    () =>
      openDialog({
        colony,
        fromDomain:
          currentDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID
            ? currentDomainId
            : undefined,
      }),
    [openDialog, colony, currentDomainId],
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

  const isSupportedColonyVersion =
    parseInt(colony.version, 10) >= ColonyVersion.CeruleanLightweightSpaceship;
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];
  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
        {canMoveFunds && (
          <span className={styles.fundingButton}>
            <Button
              appearance={{ theme: 'blue' }}
              onClick={handleMoveTokens}
              text={MSG.buttonFund}
              disabled={
                !isSupportedColonyVersion ||
                !isNetworkAllowed ||
                !hasRegisteredProfile ||
                !isDeploymentFinished
              }
            />
          </span>
        )}
      </Heading>
      {data && !isLoadingTokenBalances ? (
        <ul>
          {data.tokens.map((token) => (
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
