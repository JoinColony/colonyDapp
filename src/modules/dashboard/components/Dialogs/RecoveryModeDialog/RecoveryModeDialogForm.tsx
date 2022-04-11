import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';

import { useLoggedInUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { canEnterRecoveryMode } from '~modules/users/checks';

import { RECOVERY_HELP } from '~externalUrls';

import { FormValues } from './RecoveryModeDialog';
import styles from './RecoveryModeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.RecoveryModeDialog.RecoveryModeDialogForm.title',
    defaultMessage: 'Enter Recovery mode',
  },
  recoveryModeDescription: {
    id: `dashboard.RecoveryModeDialog.RecoveryModeDialogForm.recoveryModeDescription`,
    defaultMessage: `If you believe that something dangerous is happening in
    your colony (e.g. it is under attack), recovery mode will disable the colony
    and prevent further activity until the issue has been overcome.`,
  },
  leavingRecoveryModeDescription: {
    id: `dashboard.RecoveryModeDialog.RecoveryModeDialogForm.leavingRecoveryModeDescription`,
    defaultMessage: `
    Leaving recovery requires the approval of a majority of members
    holding the {roleRequired} permission. <a>Learn more.</a>`,
  },
  annotation: {
    id: 'dashboard.RecoveryModeDialog.RecoveryModeDialogForm.annotation',
    defaultMessage:
      'Explain why you’re putting this colony into recovery mode (optional)',
  },
  noPermission: {
    id: 'dashboard.RecoveryModeDialog.RecoveryModeDialogForm.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
});

interface Props {
  back: () => void;
  colony: Colony;
}

const RecoveryModeDialogForm = ({
  back,
  colony,
  handleSubmit,
  isSubmitting,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;

  const userHasPermission =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Recovery]} />
        </DialogSection>
      )}
      <DialogSection>
        <FormattedMessage {...MSG.recoveryModeDescription} />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.leavingRecoveryMessage}>
          <FormattedMessage
            {...MSG.leavingRecoveryModeDescription}
            values={{
              roleRequired: (
                <PermissionsLabel
                  permission={ColonyRole.Recovery}
                  name={{
                    id: `role.${ColonyRole.Recovery}`,
                  }}
                />
              ),
              a: (chunks) => (
                <a
                  href={RECOVERY_HELP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {chunks}
                </a>
              ),
            }}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!userHasPermission || isSubmitting}
          dataTest="recoveryAnnotation"
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
                    permission={ColonyRole.Recovery}
                    name={{
                      id: `role.${ColonyRole.Recovery}`,
                    }}
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
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={!userHasPermission || isSubmitting}
          data-test="recoveryConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default RecoveryModeDialogForm;
