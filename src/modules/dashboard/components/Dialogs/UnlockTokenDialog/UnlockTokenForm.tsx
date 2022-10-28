import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';

import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';
import { DialogSection, ActionDialogProps } from '~core/Dialog';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import ForceToggle from '~core/Fields/ForceToggle';
import { Annotations } from '~core/Fields';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import { TOKEN_UNLOCK_INFO } from '~externalUrls';

import styles from './UnlockTokenForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.UnlockTokenDialog.UnlockTokenForm.dialogTitle',
    defaultMessage: 'Unlock Token',
  },
  description: {
    id: 'dashboard.UnlockTokenDialog.UnlockTokenForm.description',
    defaultMessage: `Your colony’s native token is locked and non-transferrable
     by default. This action allows you to unlock it so that it may be
     freely transferred between accounts.`,
  },
  note: {
    id: 'dashboard.UnlockTokenDialog.UnlockTokenForm.note',
    defaultMessage:
      'Please note: this action is irreversible. Use with caution',
  },
  noPermission: {
    id: 'dashboard.UnlockTokenDialog.UnlockTokenForm.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  unlockedTitle: {
    id: 'dashboard.UnlockTokenDialog.UnlockTokenForm.unlockedTitle',
    defaultMessage: 'Token Unlocked',
  },
  unlockedDescription: {
    id: 'dashboard.UnlockTokenDialog.UnlockTokenForm.unlockedDescription',
    defaultMessage: `Your colony’s native token has already been unlocked.`,
  },
  annotation: {
    id: `dashboard.UnlockTokenDialog.UnlockTokenForm.annotation`,
    defaultMessage: "Explain why you're unlocking the native token (optional)",
  },
  cannotCreateMotion: {
    id: `dashboard.UnlockTokenDialog.UnlockTokenForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const UnlockTokenForm = ({
  colony: { isNativeTokenLocked, canColonyUnlockNativeToken, colonyAddress },
  colony,
  back,
  isSubmitting,
  isValid,
  handleSubmit,
  values,
}: ActionDialogProps & FormikProps<any>) => {
  const { walletAddress } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRootPermission = hasRoot(allUserRoles);
  const canUserUnlockNativeToken =
    hasRootPermission && canColonyUnlockNativeToken && isNativeTokenLocked;

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colonyAddress,
    canUserUnlockNativeToken,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled =
    !userHasPermission || onlyForceAction || !isNativeTokenLocked;

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
            {canUserUnlockNativeToken && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && isNativeTokenLocked && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.wrapper}>
            <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        {isNativeTokenLocked ? (
          <FormattedMessage {...MSG.description} />
        ) : (
          <div className={styles.unlocked}>
            <FormattedMessage {...MSG.unlockedDescription} />
          </div>
        )}
      </DialogSection>
      {isNativeTokenLocked && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.note}>
            <FormattedMessage {...MSG.note} />
            <ExternalLink
              className={styles.learnMoreLink}
              text={{ id: 'text.learnMore' }}
              href={TOKEN_UNLOCK_INFO}
            />
          </div>
        </DialogSection>
      )}
      {isNativeTokenLocked && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <Annotations
            label={MSG.annotation}
            name="annotationMessage"
            disabled={inputDisabled}
            dataTest="unlockTokenAnnotation"
          />
        </DialogSection>
      )}
      {/* tslint being stupid */}
      {/* eslint-disable-next-line max-len */}
      {!(hasRootPermission || isVotingExtensionEnabled) && isNativeTokenLocked && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{
                      id: `role.${ColonyRole.Root}`,
                    }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      {onlyForceAction && isNativeTokenLocked && <NotEnoughReputation />}
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
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={
            values.forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          disabled={cannotCreateMotion || !isValid || inputDisabled}
          style={{ minWidth: styles.wideButton }}
          data-test="unlockTokenConfirmButton"
        />
      </DialogSection>
    </>
  );
};

UnlockTokenForm.displayName = 'dashboard.UnlockTokenDialog.UnlockTokenForm';

export default UnlockTokenForm;
