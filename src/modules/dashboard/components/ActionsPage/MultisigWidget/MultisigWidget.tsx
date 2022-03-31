import React, { RefObject, useCallback, useMemo } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage } from 'react-intl';

import HookedUserAvatar from '~users/HookedUserAvatar';
import PermissionsLabel from '~core/PermissionsLabel';
import ProgressBar from '~core/ProgressBar';
import { ActionButton } from '~core/Button';
import { Tooltip } from '~core/Popover';
import { MiniSpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useRecoveryRolesAndApprovalsForSessionQuery,
  useGetRecoveryRequiredApprovalsQuery,
  useLoggedInUser,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';

import styles from './MultisigWidget.css';

const displayName = 'dashboard.ActionsPage.MultisigWidget';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.MultisigWidget.title',
    defaultMessage: `Members with {permissionLabel} permission`,
  },
  progressBarLabel: {
    id: 'dashboard.ActionsPage.MultisigWidget.progressBarLabel',
    defaultMessage: `{value} of {max} signatures {totalRequired}`,
  },
  totalRequired: {
    id: 'dashboard.ActionsPage.MultisigWidget.totalRequired',
    defaultMessage: `({required} required)`,
  },
  alreadyApprovedNotice: {
    id: 'dashboard.ActionsPage.MultisigWidget.alreadyApprovedNotice',
    defaultMessage: `You already approved to exit the recovery mode`,
  },
  approvedState: {
    id: 'dashboard.ActionsPage.MultisigWidget.approvedState',
    defaultMessage: `{approved, select,
      true {Approved}
      other {Did not yet approve}
    }`,
  },
  loadingData: {
    id: 'dashboard.ActionsPage.MultisigWidget.loadingData',
    defaultMessage: 'Loading members information...',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: true });

interface Props {
  colony: Colony;
  startBlock?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
  isInRecoveryMode?: boolean;
}

const MultisigWidget = ({
  colony: { colonyAddress },
  colony,
  startBlock = 1,
  scrollToRef,
  isInRecoveryMode = false,
}: Props) => {
  const { username, ethereal, walletAddress } = useLoggedInUser();

  const { data, loading } = useRecoveryRolesAndApprovalsForSessionQuery({
    variables: {
      colonyAddress,
      blockNumber: startBlock,
    },
    fetchPolicy: 'network-only',
  });

  const { data: requiredApprovals } = useGetRecoveryRequiredApprovalsQuery({
    variables: {
      colonyAddress,
      blockNumber: startBlock,
    },
  });

  const maxPotentialApprovals =
    data?.recoveryRolesAndApprovalsForSession?.length || 0;

  const currentApprovals = useMemo(() => {
    if (data?.recoveryRolesAndApprovalsForSession) {
      return data?.recoveryRolesAndApprovalsForSession.reduce(
        (approvalsTotal, currentUser) => {
          if (currentUser?.approvedRecoveryExit) {
            return approvalsTotal + 1;
          }
          return approvalsTotal;
        },
        0,
      );
    }
    return 0;
  }, [data]);

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      walletAddress,
      startBlock,
      scrollToRef,
    })),
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = userHasRole(allUserRoles, ColonyRole.Recovery);
  const hasAlreadyApproved = data?.recoveryRolesAndApprovalsForSession?.find(
    ({ profile: { walletAddress: userAddress } }) =>
      userAddress === walletAddress,
  )?.approvedRecoveryExit;

  const MembersWithPermissions = () => (
    <div className={styles.title}>
      <FormattedMessage
        {...MSG.title}
        values={{
          permissionLabel: (
            <PermissionsLabel permission={ColonyRole.Recovery} />
          ),
        }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <MembersWithPermissions />
        <MiniSpinnerLoader
          className={styles.loading}
          loadingText={MSG.loadingData}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <MembersWithPermissions />
      <div className={styles.avatars}>
        {data?.recoveryRolesAndApprovalsForSession?.map((user) => (
          <div key={user.id}>
            <Tooltip
              placement="right"
              trigger="hover"
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage
                    {...MSG.approvedState}
                    values={{ approved: user.approvedRecoveryExit }}
                  />
                </div>
              }
            >
              <div className={styles.avatarWrapper}>
                <UserAvatar
                  user={user}
                  size="s"
                  address={user.profile.walletAddress}
                  notSet={false}
                  showInfo
                />
                <span
                  className={`${styles.status} ${
                    user.approvedRecoveryExit && styles.statusApproved
                  }`}
                />
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
      <p className={styles.progressBarLabel}>
        <FormattedMessage
          {...MSG.progressBarLabel}
          values={{
            value: currentApprovals,
            max: maxPotentialApprovals,
            totalRequired: (
              <span className={styles.totalRequired}>
                <FormattedMessage
                  {...MSG.totalRequired}
                  values={{
                    required:
                      requiredApprovals?.getRecoveryRequiredApprovals || 0,
                  }}
                />
              </span>
            ),
          }}
        />
      </p>
      <ProgressBar value={currentApprovals} max={maxPotentialApprovals} />
      <div className={styles.controls}>
        {hasRegisteredProfile && userHasPermission && isInRecoveryMode && (
          <Tooltip
            placement="right"
            trigger={hasAlreadyApproved ? 'hover' : 'disabled'}
            content={
              <div className={styles.tooltip}>
                <FormattedMessage {...MSG.alreadyApprovedNotice} />
              </div>
            }
          >
            <div className={styles.buttonWrapper}>
              <ActionButton
                appearance={{ theme: 'primary', size: 'medium' }}
                submit={ActionTypes.COLONY_ACTION_RECOVERY_APPROVE}
                error={ActionTypes.COLONY_ACTION_RECOVERY_APPROVE_ERROR}
                success={ActionTypes.COLONY_ACTION_RECOVERY_APPROVE_SUCCESS}
                transform={transform}
                text={{ id: 'button.approve' }}
                disabled={hasAlreadyApproved}
                data-test="approveExitButton"
              />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

MultisigWidget.displayName = displayName;

export default MultisigWidget;
