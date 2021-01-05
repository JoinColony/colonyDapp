import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';

import { useLoggedInUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../transformers';
import { canEnterRecoveryMode } from '../../../users/checks';

import styles from './RecoveryModeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'admin.RecoveryModeDialog.RecoveryModeDialogForm.title',
    defaultMessage: 'Enter Recovery mode',
  },
  description1: {
    id: 'admin.RecoveryModeDialog.RecoveryModeDialogForm.description1',
    defaultMessage: `If you believe that something dangerous is happening in
    your colony (e.g. it is under attack), recovery mode will disable the colony
    and prevent further activity until the issue has been overcome.`,
  },
  description2: {
    id: 'admin.RecoveryModeDialog.RecoveryModeDialogForm.description2',
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
    defaultMessage:
      // eslint-disable-next-line max-len
      'You do not have the {roleRequired} permission required to take this action.',
  },
});

interface Props {
  back: () => void;
  colony: Colony;
}

const RecoveryModeDialogForm = ({ back, colony }: Props) => {
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
        <FormattedMessage {...MSG.description1} />
      </DialogSection>
      <DialogSection>
        <div className={styles.permissionLabel}>
          <FormattedMessage
            {...MSG.description2}
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
                <a href="/" target="_blank" className={styles.link}>
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
          name="annotations"
          disabled={!userHasPermission}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <div className={styles.permissionLabel}>
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
        />
      </DialogSection>
    </>
  );
};

export default RecoveryModeDialogForm;
