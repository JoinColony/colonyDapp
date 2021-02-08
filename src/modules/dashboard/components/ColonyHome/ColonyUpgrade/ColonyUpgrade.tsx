import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import NetworkContractUpgradeDialog from '~dashboard/NetworkContractUpgradeDialog';
import Alert from '~core/Alert';
import Button from '~core/Button';

import { Colony, useNetworkContracts } from '~data/index';
import { useLoggedInUser } from '~data/helpers';
import { useTransformer } from '~utils/hooks';
import { canBeUpgraded } from '../../../checks';
import { hasRoot } from '../../../../users/checks';
import { getAllUserRoles } from '../../../../transformers';

import styles from './ColonyUpgrade.css';

const MSG = defineMessages({
  upgradeRequired: {
    id: `dashboard.ColonyHome.ColonyUpgrade.upgradeRequired`,
    defaultMessage: `This colony uses a version of the network that is no
      longer supported. You must upgrade to continue using this application.`,
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyUpgrade';

const ColonyUpgrade = ({ colony }: Props) => {
  const openUpgradeVersionDialog = useDialog(NetworkContractUpgradeDialog);
  const { version: networkVersion } = useNetworkContracts();
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const handleUpgradeColony = useCallback(
    () =>
      openUpgradeVersionDialog({
        colony,
      }),
    [colony, openUpgradeVersionDialog],
  );

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canUpgradeColony = hasRegisteredProfile && hasRoot(allUserRoles);
  /*
   * @NOTE As a future upgrade, we can have a mapping where we keep track of
   * past and current network versions so that we can control, more granularly,
   * which versions *must* be upgraded, and which can function as-is, even with
   * an older version
   */
  const mustUpgradeColony = canBeUpgraded(
    colony,
    parseInt(networkVersion || '0', 10),
  );

  return mustUpgradeColony ? (
    <div className={styles.upgradeBannerContainer}>
      <Alert
        appearance={{
          theme: 'danger',
          margin: 'none',
          borderRadius: 'none',
        }}
      >
        <div className={styles.upgradeBanner}>
          <FormattedMessage {...MSG.upgradeRequired} />
        </div>
        <Button
          appearance={{ theme: 'primary', size: 'medium' }}
          text={{ id: 'button.upgrade' }}
          onClick={handleUpgradeColony}
          disabled={!canUpgradeColony}
        />
      </Alert>
    </div>
  ) : null;
};

ColonyUpgrade.displayName = displayName;

export default ColonyUpgrade;
