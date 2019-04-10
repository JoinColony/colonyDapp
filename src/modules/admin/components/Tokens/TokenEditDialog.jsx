/* @flow */

import type { FormikProps } from 'formik';

// $FlowFixMe until hooks flow types
import React from 'react';
import { defineMessages } from 'react-intl';

import type { TokenReferenceType, TokenType } from '~immutable';
import type { ActionTypeString } from '~redux';
import type { ActionTransformFnType } from '~utils/actions';

import { useDataFetcher } from '~utils/hooks';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Checkbox, ActionForm, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { tokenIsETH } from '../../../dashboard/checks';
import { tokenFetcher } from '../../../dashboard/fetchers';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'admin.Tokens.TokenEditDialog.title',
    defaultMessage: 'Add Token',
  },
  instructionText: {
    id: 'admin.Tokens.TokenEditDialog.instructionText',
    defaultMessage: 'Please select from these ERC20 tokens.',
  },
  fieldLabel: {
    id: 'admin.Tokens.TokenEditDialog.fieldLabel',
    defaultMessage: 'Add Tokens',
  },
  buttonCancel: {
    id: 'admin.Tokens.EditTokensModal.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'admin.Tokens.EditTokensModal.buttonConfirm',
    defaultMessage: 'Confirm',
  },
  errorNativeTokenRequired: {
    id: 'admin.Tokens.EditTokensModal.errorNativeTokenRequired',
    defaultMessage: 'The native token must be selected.',
  },
  unknownToken: {
    id: 'admin.Tokens.EditTokensModal.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

type Props = {|
  cancel: () => void,
  close: () => void,
  availableTokens: TokenReferenceType[],
  selectedTokens: string[],
  submit: ActionTypeString,
  success: ActionTypeString,
  error: ActionTypeString,
  transform?: ActionTransformFnType,
|};

const TokenCheckbox = ({
  token: { address, isNative = false },
  token: tokenReference,
}: {
  token: TokenReferenceType,
}) => {
  const { data: token } = useDataFetcher<TokenType>(
    tokenFetcher,
    [address],
    [address],
  );
  return token ? (
    <Checkbox
      className={styles.tokenChoice}
      value={address}
      name="tokens"
      disabled={isNative || tokenIsETH(token)}
    >
      <TokenIcon token={tokenReference} name={token.name} />
      <span className={styles.tokenChoiceSymbol}>
        <Heading
          text={token.symbol || token.name || MSG.unknownToken}
          appearance={{ size: 'small', margin: 'none' }}
        />
        {(!!token.symbol && token.name) || address}
      </span>
    </Checkbox>
  ) : (
    <SpinnerLoader />
  );
};

const TokenEditDialog = ({
  availableTokens = [],
  selectedTokens = [],
  cancel,
  close,
  submit,
  error,
  success,
  transform,
}: Props) => (
  <Dialog cancel={cancel}>
    <ActionForm
      initialValues={{
        tokens: selectedTokens,
      }}
      onSuccess={close}
      submit={submit}
      error={error}
      success={success}
      transform={transform}
    >
      {({ isSubmitting }: FormikProps<*>) => (
        <>
          <DialogSection>
            <Heading
              appearance={{ size: 'medium', margin: 'none' }}
              text={MSG.title}
            />
          </DialogSection>
          <DialogSection>
            <Heading
              text={MSG.instructionText}
              appearance={{ size: 'normal', weight: 'thin' }}
            />
            <InputLabel label={MSG.fieldLabel} />
            <div className={styles.tokenChoiceContainer}>
              {availableTokens.map(token => (
                <TokenCheckbox key={token.address} token={token} />
              ))}
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right' }}>
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={cancel}
              text={MSG.buttonCancel}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              loading={isSubmitting}
              text={MSG.buttonConfirm}
              type="submit"
            />
          </DialogSection>
        </>
      )}
    </ActionForm>
  </Dialog>
);

TokenEditDialog.displayName = 'admin.Tokens.TokenEditDialog';

export default TokenEditDialog;
