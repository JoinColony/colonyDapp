import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import { Input, Annotations } from '~core/Fields';
import { ColonyTokens, OneToken, Colony, useLoggedInUser } from '~data/index';
import DialogSection from '~core/Dialog/DialogSection';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useTransformer } from '~utils/hooks';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import Heading from '~core/Heading';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

import { FormValues } from './TokenMintDialog';

import styles from './TokenMintForm.css';

const MSG = defineMessages({
  title: {
    id: 'admin.Tokens.TokenMintDialog.dialogTitle',
    defaultMessage: 'Mint new tokens',
  },
  amountLabel: {
    id: 'admin.Tokens.TokenMintDialog.amountLabel',
    defaultMessage: 'Amount',
  },
  annotationLabel: {
    id: 'admin.Tokens.TokenMintDialog.annotationLabel',
    defaultMessage: `Explain why you're minting more tokens (optional)`,
  },
});

interface Props {
  colony: Colony;
  back?: () => void;
  nativeToken?: ColonyTokens[0] | OneToken;
}

const TokenMintForm = ({
  colony: { canMintNativeToken },
  colony,
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
      </DialogSection>
      {!userHasPermissions && (
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
