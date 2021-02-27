import React, { RefObject } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage } from 'react-intl';

import HookedUserAvatar from '~users/HookedUserAvatar';
import PermissionsLabel from '~core/PermissionsLabel';
import ProgressBar from '~core/ProgressBar';
import { ActionButton } from '~core/Button';
import { Tooltip } from '~core/Popover';

import {
  Colony,
  useRecoveryRolesAndApprovalsForSessionQuery,
  useLoggedInUser,
} from '~data/index';
import { ActionTypes } from '~redux/index';

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
});

const UserAvatar = HookedUserAvatar({ fetchUser: true });

interface Props {
  colony: Colony;
  startBlock?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const MultisigWidget = ({
  colony: { colonyAddress },
  startBlock = 1,
}: Props) => {
  const { username, ethereal, walletAddress } = useLoggedInUser();

  const { data } = useRecoveryRolesAndApprovalsForSessionQuery({
    variables: {
      colonyAddress,
      blockNumber: startBlock,
    },
  });

  const hasRegisteredProfile = !!username && !ethereal;
  const hasAlreadyApproved = data?.recoveryRolesAndApprovalsForSession?.find(
    ({ profile: { walletAddress: userAddress } }) =>
      userAddress === walletAddress,
  )?.approvedRecoveryExit;

  return (
    <div className={styles.wrapper}>
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
            value: 5,
            max: 10,
            totalRequired: (
              <span className={styles.totalRequired}>
                <FormattedMessage
                  {...MSG.totalRequired}
                  values={{ required: 8 }}
                />
              </span>
            ),
          }}
        />
      </p>
      <ProgressBar value={5} max={18} />
      <div className={styles.controls}>
        {hasRegisteredProfile && (
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
                submit={ActionTypes.COLONY_ACTION_GENERIC}
                error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
                success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
                // transform={transform}
                text={{ id: 'button.approve' }}
                disabled={hasAlreadyApproved}
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
