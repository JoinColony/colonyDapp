import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert from '~core/Alert';
import { ActionButton } from '~core/Button';

import { Colony, useNetworkContracts } from '~data/index';
import { useLoggedInUser } from '~data/helpers';
import { useTransformer } from '~utils/hooks';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { colonyCanBeUpgraded } from '~modules/dashboard/checks';
import { hasRoot, canEnterRecoveryMode } from '~modules/users/checks';
import { getAllUserRoles } from '~modules/transformers';

import styles from './ColonyFinishDeployment.css';

const MSG = defineMessages({
  deploymentNotFinished: {
    id: `dashboard.ColonyHome.ColonyFinishDeployment.deploymentNotFinished`,
    defaultMessage: `Colony creation incomplete. Click to continue 👉`,
  },
  buttonFinishDeployment: {
    id: `dashboard.ColonyHome.ColonyFinishDeployment.buttonFinishDeployment`,
    defaultMessage: `Finish Deployment`,
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyFinishDeployment';

const ColonyFinishDeployment = ({
  colony,
  colony: { isDeploymentFinished, colonyAddress },
}: Props) => {
  const { version: networkVersion } = useNetworkContracts();
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
    })),
    [colonyAddress],
  );

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canUpgradeColony = hasRegisteredProfile && hasRoot(allUserRoles);
  const canFinishDeployment =
    canUpgradeColony && canEnterRecoveryMode(allUserRoles);

  /*
   * @NOTE As a future upgrade, we can have a mapping where we keep track of
   * past and current network versions so that we can control, more granularly,
   * which versions *must* be upgraded, and which can function as-is, even with
   * an older version
   */
  const mustUpgradeColony = colonyCanBeUpgraded(
    colony,
    networkVersion as string,
  );

  return !mustUpgradeColony && !isDeploymentFinished && canFinishDeployment ? (
    <div className={styles.finishDeploymentBannerContainer}>
      <Alert
        appearance={{
          theme: 'danger',
          margin: 'none',
          borderRadius: 'none',
        }}
      >
        <div className={styles.finishDeploymentBanner}>
          <FormattedMessage {...MSG.deploymentNotFinished} />
        </div>
        <ActionButton
          appearance={{ theme: 'primary', size: 'medium' }}
          text={MSG.buttonFinishDeployment}
          submit={ActionTypes.DEPLOYMENT_RESTART}
          error={ActionTypes.DEPLOYMENT_RESTART_ERROR}
          success={ActionTypes.DEPLOYMENT_RESTART_SUCCESS}
          transform={transform}
          disabled={!canFinishDeployment}
        />
      </Alert>
    </div>
  ) : null;
};

ColonyFinishDeployment.displayName = displayName;

export default ColonyFinishDeployment;
