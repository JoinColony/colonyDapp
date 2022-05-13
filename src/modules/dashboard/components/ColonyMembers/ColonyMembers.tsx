import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyVersion, Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { AddressZero } from 'ethers/constants';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { BanUserDialog } from '~core/Comment';
import Heading from '~core/Heading';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  DEFAULT_TOKEN_DECIMALS,
} from '~constants';

import LoadingTemplate from '~pages/LoadingTemplate';
import Members from '~dashboard/Members';
import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';
import InviteLinkButton from '~dashboard/InviteLinkButton';

import {
  useColonyFromNameQuery,
  Colony,
  useColonyExtensionsQuery,
  useBannedUsersQuery,
  useLoggedInUser,
  useUserReputationQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getFormattedTokenValue } from '~utils/tokens';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot, canAdminister } from '~modules/users/checks';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const MSG = defineMessages({
  editPermissions: {
    id: 'dashboard.ColonyMembers.editPermissions',
    defaultMessage: 'Edit permissions',
  },
  banAddress: {
    id: 'dashboard.ColonyMembers.banAddress',
    defaultMessage: 'Ban address',
  },
  unbanAddress: {
    id: 'dashboard.ColonyMembers.unbanAddress',
    defaultMessage: 'Unban address',
  },
  loadingText: {
    id: 'dashboard.ColonyMembers.loadingText',
    defaultMessage: 'Loading Colony',
  },
  totalReputationTitle: {
    id: 'dashboard.ColonyMembers.totalReputationTitle',
    defaultMessage: 'Total reputation in team',
  },
  reputationPoints: {
    id: 'dashboard.ColonyMembers.reputationPoints',
    defaultMessage: '{teamReputationPoints} reputation points',
  },
});

const ColonyMembers = () => {
  const {
    networkId,
    username,
    ethereal,
    walletAddress: currentUserWalletAddress,
  } = useLoggedInUser();
  const { domainId } = useParams<{
    domainId: string;
  }>();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const hasRegisteredProfile = !!username && !ethereal;

  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);
  const openToggleBanningDialog = useDialog(BanUserDialog);

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const colonyAddress = colonyData?.processedColony?.colonyAddress || '';

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  const {
    data: colonyExtensions,
    loading: colonyExtensionLoading,
  } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const {
    data: bannedMembers,
    loading: loadingBannedUsers,
  } = useBannedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    /*
     * @NOTE DomainId param sanitization
     *
     * We don't actually need to worry about sanitizing the domainId that's
     * coming in from the params.
     * The value that reaches us through the hook is being processes by `react-router`
     * and will always be a string.
     *
     * So if we can change that string into a number, we use it as domain, otherwise
     * we fall back to the "All Domains" selection
     */
    parseInt(domainId, 10) || COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const { data: totalReputation } = useUserReputationQuery({
    variables: {
      address: AddressZero,
      colonyAddress,
      domainId: selectedDomainId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const openPermissionManagementDialog = useDialog(PermissionManagementDialog);

  const handlePermissionManagementDialog = useCallback(() => {
    openPermissionManagementDialog({
      colony: colonyData?.processedColony as Colony,
      isVotingExtensionEnabled,
    });
  }, [openPermissionManagementDialog, colonyData, isVotingExtensionEnabled]);

  const selectedDomain = colonyData?.processedColony.domains.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

  const nativeToken = colonyData?.processedColony.tokens.find(
    ({ address }) => address === colonyData?.processedColony.nativeTokenAddress,
  );

  const formattedTotalDomainRep = getFormattedTokenValue(
    new Decimal(totalReputation?.userReputation || '0').abs().toString(),
    nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  // eslint-disable-next-line max-len
  const oneTxPaymentExtension = colonyExtensions?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  const isSupportedColonyVersion =
    parseInt(colonyData?.processedColony?.version || '1', 10) >=
    ColonyVersion.LightweightSpaceship;

  const currentUserRoles = useTransformer(getAllUserRoles, [
    colonyData?.processedColony,
    currentUserWalletAddress,
  ]);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

  const controlsDisabled =
    !isSupportedColonyVersion ||
    !isNetworkAllowed ||
    !hasRegisteredProfile ||
    !colonyData?.processedColony?.isDeploymentFinished ||
    mustUpgradeOneTx;

  if (
    loading ||
    colonyExtensionLoading ||
    loadingBannedUsers ||
    (colonyData?.colonyAddress &&
      !colonyData.processedColony &&
      !((colonyData.colonyAddress as any) instanceof Error))
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colonyName || error || !colonyData?.processedColony) {
    console.error(error);
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.processedColony && (
            <Members
              colony={colonyData.processedColony}
              bannedUsers={bannedMembers?.bannedUsers || []}
              selectedDomain={selectedDomain}
              handleDomainChange={setSelectedDomainId}
            />
          )}
        </div>
        <aside className={styles.rightAside}>
          <div className={styles.teamReputationPointsContainer}>
            <Heading
              text={MSG.totalReputationTitle}
              appearance={{ size: 'normal', theme: 'dark' }}
            />
            <p className={styles.reputationPoints}>
              <FormattedMessage
                {...MSG.reputationPoints}
                values={{
                  teamReputationPoints: formattedTotalDomainRep,
                }}
              />
            </p>
          </div>
          <ul className={styles.controls}>
            <li>
              <InviteLinkButton
                colonyName={colonyName}
                buttonAppearance={{ theme: 'blue' }}
              />
            </li>
            {!controlsDisabled && (
              <>
                <li>
                  <Button
                    appearance={{ theme: 'blue' }}
                    text={MSG.editPermissions}
                    onClick={handlePermissionManagementDialog}
                    disabled={
                      !isSupportedColonyVersion ||
                      !isNetworkAllowed ||
                      !hasRegisteredProfile ||
                      !colonyData?.processedColony?.isDeploymentFinished ||
                      mustUpgradeOneTx
                    }
                  />
                </li>
                {canAdministerComments && (
                  <>
                    <li>
                      <Button
                        appearance={{ theme: 'blue' }}
                        text={MSG.banAddress}
                        onClick={() =>
                          openToggleBanningDialog({
                            colonyAddress:
                              colonyData?.processedColony?.colonyAddress,
                          })
                        }
                      />
                    </li>
                    <li>
                      <Button
                        appearance={{ theme: 'blue' }}
                        text={MSG.unbanAddress}
                        onClick={() =>
                          openToggleBanningDialog({
                            isBanning: false,
                            colonyAddress:
                              colonyData?.processedColony?.colonyAddress,
                          })
                        }
                      />
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
