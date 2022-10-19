import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import NetworkContractUpgradeDialog from '~dialogs/NetworkContractUpgradeDialog';
import Alert from '~core/Alert';
import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';

import { Colony, useNetworkContracts } from '~data/index';
import { useLoggedInUser } from '~data/helpers';
import { useTransformer } from '~utils/hooks';
import { getNetworkRelaseLink } from '~utils/external';
import {
  colonyMustBeUpgraded,
  colonyShouldBeUpgraded,
} from '~modules/dashboard/checks';
import { hasRoot } from '~modules/users/checks';
import { getAllUserRoles } from '~modules/transformers';

import styles from './ColonyUpgrade.css';

const MSG = defineMessages({
  upgradeRequired: {
    id: `dashboard.ColonyHome.ColonyUpgrade.upgradeRequired`,
    defaultMessage: `This colony uses a version of the network that is no
      longer supported. You must upgrade to continue using this application.`,
  },
  upgradeSuggested: {
    id: `dashboard.ColonyHome.ColonyUpgrade.upgradeSuggested`,
    defaultMessage: `A new version of the Colony Network is available! {linkToRelease}`,
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

  const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  const shouldUpdgrade = colonyShouldBeUpgraded(
    colony,
    networkVersion as string,
  );

  if (mustUpgrade) {
    return (
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
          <div className={styles.controls}>
            <Button
              appearance={{ theme: 'primary', size: 'medium' }}
              text={{ id: 'button.upgrade' }}
              onClick={handleUpgradeColony}
              disabled={!canUpgradeColony}
            />
          </div>
        </Alert>
      </div>
    );
  }

  if (shouldUpdgrade) {
    return (
      <div className={styles.upgradeBannerContainer}>
        <Alert
          appearance={{
            theme: 'info',
            margin: 'none',
            borderRadius: 'none',
          }}
        >
          {(handleDismissed) => (
            <>
              <div className={styles.upgradeBanner}>
                <FormattedMessage
                  {...MSG.upgradeSuggested}
                  values={{
                    linkToRelease: (
                      <ExternalLink
                        text={{ id: 'text.learnMore' }}
                        href={getNetworkRelaseLink(
                          parseInt(colony.version, 10) + 1,
                        )}
                      />
                    ),
                  }}
                />
              </div>
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'danger', size: 'medium' }}
                  text={{ id: 'button.dismiss' }}
                  onClick={handleDismissed}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  text={{ id: 'button.upgrade' }}
                  onClick={handleUpgradeColony}
                  disabled={!canUpgradeColony}
                />
              </div>
            </>
          )}
        </Alert>
      </div>
    );
  }

  return null;
};

ColonyUpgrade.displayName = displayName;

export default ColonyUpgrade;
