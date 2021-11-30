import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';
import Toggle from '~core/Fields/Toggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { ColonyTokens, OneToken } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';

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
});

interface Props extends ActionDialogProps {
  nativeToken?: ColonyTokens[0] | OneToken;
}

const TokenMintForm = ({
  colony: { canUserMintNativeToken },
  colony,
  isVotingExtensionEnabled,
  back,
  isSubmitting,
  isValid,
  handleSubmit,
  nativeToken,
  values,
}: Props & FormikProps<FormValues>) => {
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canUserMintNativeToken,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

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
            {canUserMintNativeToken && isVotingExtensionEnabled && (
              <Toggle label={{ id: 'label.force' }} name="forceAction" />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
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
              disabled={inputDisabled}
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
            disabled={inputDisabled}
          />
        </div>
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
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

TokenMintForm.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintForm;
