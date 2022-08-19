import React, { useState, useMemo } from 'react';
import {
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
import { defineMessages, FormattedMessage } from 'react-intl';
import { AddressZero } from 'ethers/constants';
import isEqual from 'lodash/isEqual';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import { ActionDialogProps, DialogSection } from '~core/Dialog';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import Paragraph from '~core/Paragraph';
import TokenSelector from '~dashboard/CreateColonyWizard/TokenSelector';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { AnyToken, OneToken, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { FormValues } from '~dialogs/ColonyTokenManagementDialog/ColonyTokenManagementDialog';

import TokenItem from './TokenItem/index';
import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.TokenEditDialog.title',
    defaultMessage: 'Manage tokens',
  },
  fieldLabel: {
    id: 'core.TokenEditDialog.fieldLabel',
    defaultMessage: 'Contract address',
  },
  textareaLabel: {
    id: 'core.TokenEditDialog.textareaLabel',
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  noTokensText: {
    id: 'core.TokenEditDialog.noTokensText',
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
  notListedToken: {
    id: 'core.TokenEditDialog.notListedToken',
    defaultMessage: `If token is not listed above, please add any ERC20 compatible token contract address below.`,
  },
  noPermission: {
    id: 'core.TokenEditDialog.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  cannotCreateMotion: {
    id: `core.TokenEditDialog.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  // Token list from json file. Not supported on local env
  tokensList?: AnyToken[];
  close: (val: any) => void;
}

const TokenEditDialog = ({
  close,
  tokensList = [],
  colony: { tokens = [], nativeTokenAddress, tokenAddresses },
  colony,
  back,
  isSubmitting,
  isValid,
  values,
  handleSubmit,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const [tokenData, setTokenData] = useState<OneToken | undefined>();
  const [tokenSelectorHasError, setTokenSelectorHasError] = useState<boolean>(
    false,
  );
  const [isLoadingAddress, setisLoadingAddress] = useState<boolean>(false);

  const handleTokenSelect = (checkingAddress: boolean, token: OneToken) => {
    setTokenData(token);
    setisLoadingAddress(checkingAddress);
  };

  const handleTokenSelectError = (hasError: boolean) => {
    setTokenSelectorHasError(hasError);
  };

  const hasTokensListChanged = ({
    selectedTokenAddresses,
    tokenAddress,
  }: FormValues) =>
    !!tokenAddress ||
    !isEqual(
      [AddressZero, ...tokenAddresses].sort(),
      selectedTokenAddresses?.sort(),
    );

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canEditTokens = hasRegisteredProfile && hasRoot(allUserRoles);
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEditTokens,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  const allTokens = useMemo(() => {
    return [...tokens, ...(canEditTokens ? tokensList : [])].filter(
      ({ address: firstTokenAddress }, index, mergedTokens) =>
        mergedTokens.findIndex(
          ({ address: secondTokenAddress }) =>
            secondTokenAddress === firstTokenAddress,
        ) === index,
    );
  }, [tokens, tokensList, canEditTokens]);

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
            {canEditTokens && isVotingExtensionEnabled && (
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
        {allTokens.length > 0 ? (
          <div className={styles.tokenChoiceContainer}>
            {allTokens.map((token) => (
              <TokenItem
                key={token.address}
                token={token}
                disabled={
                  inputDisabled ||
                  token.address === nativeTokenAddress ||
                  token.address === AddressZero
                }
              />
            ))}
          </div>
        ) : (
          <Heading appearance={{ size: 'normal' }} text={MSG.noTokensText} />
        )}
      </DialogSection>
      <DialogSection>
        <Paragraph className={styles.description}>
          <FormattedMessage {...MSG.notListedToken} />
        </Paragraph>
        <TokenSelector
          tokenAddress={values.tokenAddress as string}
          onTokenSelect={handleTokenSelect}
          onTokenSelectError={handleTokenSelectError}
          tokenSelectorHasError={tokenSelectorHasError}
          isLoadingAddress={isLoadingAddress}
          tokenData={tokenData}
          label={MSG.fieldLabel}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
        />
        <div className={styles.textarea}>
          <Annotations
            label={MSG.textareaLabel}
            name="annotationMessage"
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
      {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )}
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
          text={{
            id: back === undefined ? 'button.cancel' : 'button.back',
          }}
          onClick={back === undefined ? close : back}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={
            values.forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          onClick={() => handleSubmit()}
          disabled={
            cannotCreateMotion ||
            tokenSelectorHasError ||
            !isValid ||
            inputDisabled ||
            !hasTokensListChanged(values) ||
            isLoadingAddress
          }
          type="submit"
          style={{ minWidth: styles.wideButton }}
          data-test="confirm"
        />
      </DialogSection>
    </>
  );
};

TokenEditDialog.displayName = 'core.TokenEditDialog';

export default TokenEditDialog;
