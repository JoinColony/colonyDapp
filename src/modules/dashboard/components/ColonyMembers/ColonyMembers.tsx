import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ColonyVersion, Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { AddressZero } from 'ethers/constants';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { BanUserDialog } from '~core/Comment';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  DEFAULT_TOKEN_DECIMALS,
} from '~constants';

import LoadingTemplate from '~pages/LoadingTemplate';
import Members from '~dashboard/Members';
import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';
import InviteLinkButton from '~dashboard/InviteLinkButton';
import ManageWhitelistDialog from '~dashboard/Dialogs/ManageWhitelistDialog';
import { MEMEBERS_FILTERS } from '~dashboard/ColonyMembers/MembersFilter';

import {
  useColonyFromNameQuery,
  Colony,
  useColonyExtensionsQuery,
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
import MembersFilter from './MembersFilter';

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
  manageWhitelist: {
    id: 'dashboard.ColonyMembers.manageWhitelist',
    defaultMessage: 'Manage address book',
  },
  loadingText: {
    id: 'dashboard.ColonyMembers.loadingText',
    defaultMessage: 'Loading Colony',
  },
  totalReputationTitle: {
    id: 'dashboard.ColonyMembers.totalReputationTitle',
    defaultMessage: 'Total reputation in team',
  },
});

const ColonyMembers = () => {
  const [filters, setFilters] = useState<MEMEBERS_FILTERS[]>([]);

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
    pollInterval: 5000,
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

  const openToggleManageWhitelistDialog = useDialog(ManageWhitelistDialog);

  const handleToggleWhitelistDialog = useCallback(() => {
    return openToggleManageWhitelistDialog({
      colony: colonyData?.processedColony as Colony,
    });
  }, [openToggleManageWhitelistDialog, colonyData]);

  const nativeToken = colonyData?.processedColony?.tokens.find(
    ({ address }) =>
      address === colonyData?.processedColony?.nativeTokenAddress,
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
  const canManageWhitelist = hasRegisteredProfile && hasRoot(currentUserRoles);

  const controlsDisabled =
    !isSupportedColonyVersion ||
    !isNetworkAllowed ||
    !hasRegisteredProfile ||
    !colonyData?.processedColony?.isDeploymentFinished ||
    mustUpgradeOneTx;

  if (
    loading ||
    colonyExtensionLoading ||
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
              selectedDomain={selectedDomainId}
              handleDomainChange={setSelectedDomainId}
              filters={filters}
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
              <Numeral
                value={formattedTotalDomainRep}
                suffix="reputation points"
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
                {canManageWhitelist && (
                  <li>
                    <Button
                      appearance={{ theme: 'blue' }}
                      text={MSG.manageWhitelist}
                      onClick={handleToggleWhitelistDialog}
                    />
                  </li>
                )}
              </>
            )}
          </ul>
          <MembersFilter handleFiltersCallback={setFilters} />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
