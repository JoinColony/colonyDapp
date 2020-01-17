import React, { useCallback } from 'react';
import { FormikProps, FormikConfig } from 'formik';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, InputLabel } from '~core/Fields';
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

interface FormValues {
  tokens: string[];
}

interface Props {
  cancel: () => void;
  close: () => void;
  // FIXME type correctly
  availableTokens: any[];
  onSubmit: FormikConfig<FormValues>['onSubmit'];
  nativeTokenAddress?: Address;
  selectedTokens: Address[];
}

const TokenEditDialog = ({
  availableTokens = [],
  nativeTokenAddress,
  selectedTokens = [],
  cancel,
  close,
  onSubmit,
}: Props) => {
  const handleSubmit = useCallback(
    async ({ tokens }, formikHelpers) => {
      await onSubmit({ tokens }, formikHelpers);
      close();
    },
    [onSubmit, close],
  );
  return (
    <Dialog cancel={cancel}>
      <Form
        initialValues={{
          tokens: selectedTokens,
        }}
        onSubmit={handleSubmit}
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
                  <TokenCheckbox
                    key={token.address}
                    nativeTokenAddress={nativeTokenAddress}
                    token={token}
                  />
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
      </Form>
    </Dialog>
  );
};

TokenEditDialog.displayName = 'core.TokenEditDialog';

export default TokenEditDialog;
