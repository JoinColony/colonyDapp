import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import { Input, Annotations } from '~core/Fields';
import { ColonyTokens, OneToken, Colony, useLoggedInUser } from '~data/index';
import DialogSection from '~core/Dialog/DialogSection';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useTransformer } from '~utils/hooks';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import Toggle from '~core/Fields/Toggle';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

import { FormValues } from './TokenMintDialog';

import styles from './TokenMintForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TokenMintDialog.TokenMintForm.dialogTitle',
    defaultMessage: 'Mint new tokens',
  },
  amountLabel: {
    id: 'dashboard.TokenMintDialog.TokenMintForm.amountLabel',
    defaultMessage: 'Amount',
  },
  annotationLabel: {
    id: 'dashboard.TokenMintDialog.TokenMintForm.annotationLabel',
    defaultMessage: `Explain why you're minting more tokens (optional)`,
  },
  noPermission: {
    id: 'dashboard.TokenMintDialog.TokenMintForm.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  forceMotion: {
    id: 'dashboard.TokenMintDialog.TokenMintForm.forceMotion',
    defaultMessage: 'Force',
  },
});

interface Props {
  colony: Colony;
  isVotingExtensionEnabled: boolean;
  back?: () => void;
  nativeToken?: ColonyTokens[0] | OneToken;
}

const TokenMintForm = ({
  colony: { canMintNativeToken },
  colony,
  isVotingExtensionEnabled,
  back,
  isSubmitting,
  isValid,
  handleSubmit,
  nativeToken,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const userHasPermissions = canMintNativeToken && hasRoot(allUserRoles);
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={MSG.title}
        />
        {userHasPermissions && isVotingExtensionEnabled && (
          <Toggle label={MSG.forceMotion} name="toggle" />
        )}
      </DialogSection>
      {!userHasPermissions && !isVotingExtensionEnabled && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.inputContainer}>
          <div className={styles.inputComponent}>
            <Input
              appearance={{ theme: 'minimal' }}
              formattingOptions={{
                numeral: true,
                numeralPositiveOnly: true,
                numeralDecimalScale: getTokenDecimalsWithFallback(
                  nativeToken?.decimals,
                ),
              }}
              label={MSG.amountLabel}
              name="mintAmount"
              disabled={!userHasPermissions}
            />
          </div>
          <span
            className={styles.nativeToken}
            title={nativeToken?.name || undefined}
          >
            {nativeToken?.symbol}
          </span>
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotation}>
          <Annotations
            label={MSG.annotationLabel}
            name="annotation"
            disabled={!userHasPermissions}
          />
        </div>
      </DialogSection>
      {!userHasPermissions && (
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
          disabled={!isValid || !userHasPermissions}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

TokenMintForm.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintForm;
