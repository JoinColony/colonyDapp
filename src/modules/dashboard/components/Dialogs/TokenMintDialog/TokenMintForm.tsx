import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';

import Button from '~core/Button';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { ColonyTokens, OneToken, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';

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
  cannotCreateMotion: {
    id: `dashboard.TokenMintDialog.TokenMintForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  nativeToken?: ColonyTokens[0] | OneToken;
}

const TokenMintForm = ({
  colony,
  back,
  isSubmitting,
  isValid,
  handleSubmit,
  nativeToken,
  values,
}: Props & FormikProps<FormValues>) => {
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];
  const { walletAddress } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const canUserMintNativeToken =
    hasRoot(allUserRoles) && colony.canColonyMintNativeToken;

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canUserMintNativeToken,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

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
            {canUserMintNativeToken && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
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
          data-test="mintConfirmButton"
        />
      </DialogSection>
    </>
  );
};

TokenMintForm.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintForm;
