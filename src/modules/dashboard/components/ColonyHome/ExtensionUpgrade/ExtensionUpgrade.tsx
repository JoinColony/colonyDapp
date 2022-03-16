import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { useParams } from 'react-router';

import Alert from '~core/Alert';
import Button from '~core/Button';
import { Colony, useColonyExtensionsQuery } from '~data/index';
import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

import styles from './ExtensionUpgrade.css';

const MSG = defineMessages({
  upgradeMessage: {
    id: `dashboard.ColonyHome.ExtensionUpgrade.upgradeMessage`,
    defaultMessage: `This colony uses a version of the OneTx Payment Extension that is no longer supported. You must upgrade to continue using this application.`,
  },
  goToExtensionButton: {
    id: `dashboard.ColonyHome.ExtensionUpgrade.goToExtensionButton`,
    defaultMessage: `Go to Extension`,
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ExtensionUpgrade';

const ExtensionUpgrade = ({ colony: { colonyName, colonyAddress } }: Props) => {
  const { colonyName: colonyNameEntry, extensionId } = useParams<{
    colonyName: string;
    extensionId: string;
  }>();

  const { data } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  const isExtensionDetailsRoute =
    colonyNameEntry === colonyName && extensionId === Extension.OneTxPayment;

  const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgrade = oneTxMustBeUpgraded(oneTxPaymentExtension);

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
            <FormattedMessage {...MSG.upgradeMessage} />
          </div>
          {!isExtensionDetailsRoute && (
            <div className={styles.controls}>
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                text={MSG.goToExtensionButton}
                // eslint-disable-next-line max-len
                linkTo={`/colony/${colonyName}/extensions/${Extension.OneTxPayment}`}
              />
            </div>
          )}
        </Alert>
      </div>
    );
  }

  return null;
};

ExtensionUpgrade.displayName = displayName;

export default ExtensionUpgrade;
