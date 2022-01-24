import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import ExternalLink from '~core/ExternalLink';
import { Colony, useLoggedInUser } from '~data/index';
import DialogSection from '~core/Dialog/DialogSection';
import { useTransformer } from '~utils/hooks';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';

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
});

interface Props {
  colony: Colony;
  back?: () => void;
}

const UnlockTokenForm = ({
  colony: { isNativeTokenLocked },
  colony,
  back,
  isSubmitting,
  isValid,
  handleSubmit,
}: Props & FormikProps<any>) => {
  const { walletAddress } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRootPermission = hasRoot(allUserRoles);
  const canUserUnlockNativeToken =
    hasRoot(allUserRoles) &&
    colony.canColonyUnlockNativeToken &&
    isNativeTokenLocked;
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={colony.isNativeTokenLocked ? MSG.title : MSG.unlockedTitle}
        />
      </DialogSection>
      {!hasRootPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.wrapper}>
            <PermissionRequiredInfo requiredRoles={requiredRoles} />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        {colony.isNativeTokenLocked ? (
          <FormattedMessage {...MSG.description} />
        ) : (
          <div className={styles.unlocked}>
            <FormattedMessage {...MSG.unlockedDescription} />
          </div>
        )}
      </DialogSection>
      {colony.isNativeTokenLocked && (
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
      {!hasRootPermission && (
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
          disabled={!isValid || !canUserUnlockNativeToken}
        />
      </DialogSection>
    </>
  );
};

UnlockTokenForm.displayName = 'dashboard.UnlockTokenDialog.UnlockTokenForm';

export default UnlockTokenForm;
