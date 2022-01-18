import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';
import { DialogSection, ActionDialogProps } from '~core/Dialog';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import Toggle from '~core/Fields/Toggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

import styles from './UnlockTokenForm.css';
import { Annotations } from '~core/Fields';

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
  annotation: {
    id: `dashboard.UnlockTokenDialog.UnlockTokenForm.annotation`,
    defaultMessage: "Explain why you're unlocking the native token (optional)",
  },
});

const LEARN_MORE_URL = `https://colony.gitbook.io/colony/manage-funds/unlock-token`;

const UnlockTokenForm = ({
  colony: { isNativeTokenLocked, canUnlockNativeToken },
  colony,
  isVotingExtensionEnabled,
  back,
  isSubmitting,
  isValid,
  handleSubmit,
  values,
}: ActionDialogProps & FormikProps<any>) => {
  const { walletAddress } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canUnlockNativeToken && isNativeTokenLocked,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  const hasRootPermission = hasRoot(allUserRoles);
  const canUnlockToken =
    isNativeTokenLocked && canUnlockNativeToken && hasRootPermission;

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
            {canUnlockToken && isVotingExtensionEnabled && (
              <Toggle label={{ id: 'label.force' }} name="forceAction" />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.wrapper}>
            <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <FormattedMessage {...MSG.description} />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.note}>
          <FormattedMessage {...MSG.note} />
          <ExternalLink
            className={styles.learnMoreLink}
            text={{ id: 'text.learnMore' }}
            href={LEARN_MORE_URL}
          />
        </div>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
        />
      </DialogSection>
      {!userHasPermission && (
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
      {onlyForceAction && <NotEnoughReputation />}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid || inputDisabled}
        />
      </DialogSection>
    </>
  );
};

UnlockTokenForm.displayName = 'dashboard.UnlockTokenDialog.UnlockTokenForm';

export default UnlockTokenForm;
