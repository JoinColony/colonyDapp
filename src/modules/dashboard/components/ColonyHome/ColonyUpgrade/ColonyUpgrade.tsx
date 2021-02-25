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

  const canUpgrade = canBeUpgraded(colony, networkVersion as string);

  return canUpgrade ? (
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
