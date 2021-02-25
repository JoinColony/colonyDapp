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
import { SpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useLoggedInUser,
  useNetworkContracts,
  useLegacyNumberOfRecoveryRolesQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';
import { canBeUpgraded } from '../../../dashboard/checks';

import { FormValues } from './NetworkContractUpgradeDialog';

import styles from './NetworkContractUpgradeDialogForm.css';

const MSG = defineMessages({
  title: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.title',
    defaultMessage: 'Upgrade Colony',
  },
  currentVersion: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.currentVersion',
    defaultMessage: 'Current version',
  },
  newVersion: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.newVersion',
    defaultMessage: 'New version',
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
  legacyPermissionsWarningTitle: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.legacyPermissionsWarningTitle`,
    defaultMessage: `Upgrade to the next colony version is prevented while more than one colony member has the {recoveryRole} role.`,
  },
  legacyPermissionsWarningDescription: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.legacyPermissionsWarningDescription`,
    defaultMessage: `
Please remove the {recoveryRole} role from all members {highlightInstruction}
the member who will upgrade the colony. Once complete, you will be able to
safely upgrade the colony to the next version.
    `,
  },
  legacyPermissionsWarningPost: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.legacyPermissionsWarningPost`,
    defaultMessage: `After the upgrade you can safely re-assign the {recoveryRole} role to members.`,
  },
  legacyPermissionsWarninghighlightInstruction: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.highlightInstruction`,
    defaultMessage: `except`,
  },
  loadingData: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.loadingData`,
    defaultMessage: "Loading the Colony's Recovery Roles",
  },
});

interface Props {
  back?: () => void;
  colony: Colony;
}

const NetworkContractUpgradeDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, version },
  handleSubmit,
  isSubmitting,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const {
    data,
    loading: loadingLegacyRecoveyRole,
  } = useLegacyNumberOfRecoveryRolesQuery({
    variables: {
      colonyAddress,
    },
  });

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;

  const { version: newVersion } = useNetworkContracts();

  const currentVersion = parseInt(version, 10);
  const nextVersion = currentVersion + 1;
  const networkVersion = parseInt(newVersion || '1', 10);

  const hasRootPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const canUpgradeVersion =
    hasRootPermission && canBeUpgraded(colony, newVersion as string);

  const PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES =
    /*
     * @NOTE Prettier is stupid, it keeps changing this line in a way that
     * breaks it
     */
    // eslint-disable-next-line prettier/prettier
    data?.legacyNumberOfRecoveryRoles
      ? data?.legacyNumberOfRecoveryRoles > 1
      : false;

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {loadingLegacyRecoveyRole && (
        <DialogSection>
          <div className={styles.loadingInfo}>
            <SpinnerLoader appearance={{ size: 'small' }} />
            <span className={styles.loadingText}>
              <FormattedMessage {...MSG.loadingData} />
            </span>
          </div>
        </DialogSection>
      )}
      {PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES && (
        <DialogSection>
          <div className={styles.permissionsWarning}>
            <div className={styles.warningTitle}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarningTitle}
                values={{
                  recoveryRole: (
                    <PermissionsLabel permission={ColonyRole.Recovery} />
                  ),
                }}
              />
            </div>
            <div className={styles.warningDescription}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarningDescription}
                values={{
                  recoveryRole: (
                    <PermissionsLabel permission={ColonyRole.Recovery} />
                  ),
                  highlightInstruction: (
                    <span className={styles.highlightInstruction}>
                      <FormattedMessage
                        {...MSG.legacyPermissionsWarninghighlightInstruction}
                      />
                    </span>
                  ),
                }}
              />
            </div>
            <div className={styles.warningDescription}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarningPost}
                values={{
                  recoveryRole: (
                    <PermissionsLabel permission={ColonyRole.Recovery} />
                  ),
                }}
              />
            </div>
          </div>
        </DialogSection>
      )}
      {!hasRootPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.contractVersionLine}>
          <FormattedMessage {...MSG.currentVersion} />
          <div className={styles.contractVersionNumber}>{currentVersion}</div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.contractVersionLine}>
          <FormattedMessage {...MSG.newVersion} />
          <div className={styles.contractVersionNumber}>
            {nextVersion < networkVersion ? nextVersion : newVersion}
          </div>
        </div>
        <hr className={styles.divider} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!canUpgradeVersion}
        />
      </DialogSection>
      {!hasRootPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
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
        {back && (
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={back}
            text={{ id: 'button.back' }}
          />
        )}
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.confirm' }}
          disabled={
            !canUpgradeVersion || PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES
          }
          onClick={() => handleSubmit()}
          loading={isSubmitting || loadingLegacyRecoveyRole}
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
