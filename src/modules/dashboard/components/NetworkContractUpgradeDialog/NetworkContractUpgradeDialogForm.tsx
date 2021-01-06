import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormikProps } from 'formik';
import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';

import { Colony, useLoggedInUser, useNetworkContracts } from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

import { FormValues } from './NetworkContractUpgradeDialog';
import styles from './NetworkContractUpgradeDialogForm.css';

const MSG = defineMessages({
  title: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.title',
    defaultMessage: 'Upgrade Colony',
  },
  annotation: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.annotation',
    defaultMessage: 'Explain why you are upgrading this colony (optional)',
  },
  noPermissionText: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.noPermissionText',
    defaultMessage: `You do not have the {requiredRole} permission required
      to take this action.`,
  },
});

interface Props {
  back: () => void;
  colony: Colony;
}

const NetworkContractUpgradeDialogForm = ({
  back,
  colony,
  colony: { version },
  handleSubmit,
  isSubmitting,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canUpgradeVersion = hasRegisteredProfile && hasRoot(allUserRoles);

  const { version: newVersion } = useNetworkContracts();

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!canUpgradeVersion && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection>
        <p>Current version: {version}</p>
        <p>New version: {newVersion}</p>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!canUpgradeVersion}
        />
      </DialogSection>
      {!canUpgradeVersion && (
        <DialogSection>
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermissionText}
              values={{
                requiredRole: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{ id: `role.${ColonyRole.Root}` }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.confirm' }}
          disabled={!canUpgradeVersion}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
