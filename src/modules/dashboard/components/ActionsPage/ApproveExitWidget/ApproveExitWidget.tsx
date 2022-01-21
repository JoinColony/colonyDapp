import React, { RefObject, useCallback, useMemo } from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionButton } from '~core/Button';

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

import styles from './ApproveExitWidget.css';

const displayName = 'dashboard.ActionsPage.ApproveExitWidget';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.ApproveExitWidget.title',
    defaultMessage: `Reactivate colony`,
  },
  reactivateButton: {
    id: 'dashboard.ActionsPage.ApproveExitWidget.reactivateButton',
    defaultMessage: `Reactivate`,
  },
});

interface Props {
  colony: Colony;
  startBlock?: number;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const ApproveExitWidget = ({
  colony: { colonyAddress },
  colony,
  startBlock = 1,
  scrollToRef,
}: Props) => {
  const { username, ethereal, walletAddress } = useLoggedInUser();

  const { data } = useRecoveryRolesAndApprovalsForSessionQuery({
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
      startBlock,
      scrollToRef,
    })),
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = userHasRole(allUserRoles, ColonyRole.Recovery);

  if (
    !hasRegisteredProfile ||
    !userHasPermission ||
    !requiredApprovals?.getRecoveryRequiredApprovals ||
    currentApprovals < requiredApprovals.getRecoveryRequiredApprovals
  ) {
    return null;
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </div>
      <div className={styles.controls}>
        <ActionButton
          appearance={{ theme: 'primary', size: 'medium' }}
          submit={ActionTypes.COLONY_ACTION_RECOVERY_EXIT}
          error={ActionTypes.COLONY_ACTION_RECOVERY_EXIT_ERROR}
          success={ActionTypes.COLONY_ACTION_RECOVERY_EXIT_SUCCESS}
          transform={transform}
          text={MSG.reactivateButton}
        />
      </div>
    </div>
  );
};

ApproveExitWidget.displayName = displayName;

export default ApproveExitWidget;
