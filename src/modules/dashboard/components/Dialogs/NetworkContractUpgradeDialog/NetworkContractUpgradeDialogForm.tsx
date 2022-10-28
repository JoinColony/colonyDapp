import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormikProps } from 'formik';
import {
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';

import Button from '~core/Button';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import { MiniSpinnerLoader } from '~core/Preloaders';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import {
  useLoggedInUser,
  useNetworkContracts,
  useLegacyNumberOfRecoveryRolesQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { colonyCanBeUpgraded } from '~modules/dashboard/checks';

import { FormValues } from './NetworkContractUpgradeDialog';

import styles from './NetworkContractUpgradeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.title`,
    defaultMessage: 'Upgrade Colony',
  },
  currentVersion: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.currentVersion`,
    defaultMessage: 'Current version',
  },
  newVersion: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.newVersion`,
    defaultMessage: 'New version',
  },
  annotation: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.annotation`,
    defaultMessage: 'Explain why you are upgrading this colony (optional)',
  },
  noPermissionText: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.noPermissionText`,
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
  cannotCreateMotion: {
    id: `dashboard.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const NetworkContractUpgradeDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, version },
  handleSubmit,
  isSubmitting,
  values,
}: ActionDialogProps & FormikProps<FormValues>) => {
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

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    hasRootPermission,
    isVotingExtensionEnabled,
    values.forceAction,
  );
  const canUpgradeVersion =
    userHasPermission && !!colonyCanBeUpgraded(colony, newVersion as string);

  const inputDisabled = !canUpgradeVersion || onlyForceAction || isSubmitting;

  const PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES =
    /*
     * @NOTE Prettier is stupid, it keeps changing this line in a way that
     * breaks it
     */
    // eslint-disable-next-line prettier/prettier
    data?.legacyNumberOfRecoveryRoles
      ? data?.legacyNumberOfRecoveryRoles > 1
      : false;

  const cannotCreateMotion =
    votingExtensionVersion ===
      VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
    !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                /*
                 * @NOTE Always disabled since you can only create this motion in root
                 */
                disabled
              />
            </div>
          )}
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {canUpgradeVersion && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )}
          </div>
        </div>
      </DialogSection>
      {loadingLegacyRecoveyRole && (
        <DialogSection>
          <MiniSpinnerLoader
            className={styles.loadingInfo}
            loadingText={MSG.loadingData}
          />
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
            {nextVersion < networkVersion ? nextVersion : networkVersion}
          </div>
        </div>
        <hr className={styles.divider} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
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
      {onlyForceAction && <NotEnoughReputation />}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
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
          text={
            values.forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          disabled={
            cannotCreateMotion ||
            inputDisabled ||
            PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES ||
            isSubmitting
          }
          style={{ minWidth: styles.wideButton }}
          onClick={() => handleSubmit()}
          loading={isSubmitting || loadingLegacyRecoveyRole}
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
