import { FormikProps } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';

import { TokenReferenceType } from '~immutable/index';
import { ActionTypeString } from '~redux/index';
import { ActionTransformFnType } from '~utils/actions';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import TokenCheckbox from './TokenCheckbox';
import { Address } from '~types/strings';
import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.TokenEditDialog.title',
    defaultMessage: 'Add Token',
  },
  instructionText: {
    id: 'core.TokenEditDialog.instructionText',
    defaultMessage: 'Please select from these ERC20 tokens.',
  },
  fieldLabel: {
    id: 'core.TokenEditDialog.fieldLabel',
    defaultMessage: 'Add Tokens',
  },
  buttonCancel: {
    id: 'core.TokenEditDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'core.TokenEditDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
  errorNativeTokenRequired: {
    id: 'core.TokenEditDialog.errorNativeTokenRequired',
    defaultMessage: 'The native token must be selected.',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  availableTokens: TokenReferenceType[];
  selectedTokens: Address[];
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
  transform?: ActionTransformFnType;
}

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
      {({ isSubmitting }: FormikProps<any>) => (
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

TokenEditDialog.displayName = 'core.TokenEditDialog';

export default TokenEditDialog;
