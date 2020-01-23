import React, { useCallback } from 'react';
import { FormikProps, FormikHelpers } from 'formik';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import { AnyToken } from '~data/index';
import { Address } from '~types/strings';

import TokenItem from './TokenItem/index';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.TokenEditDialog.title',
    defaultMessage: 'Edit Tokens',
  },
  errorAddingToken: {
    id: 'core.TokenEditDialog.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  fieldLabel: {
    id: 'core.TokenEditDialog.fieldLabel',
    defaultMessage: 'Enter a valid token address',
  },
  buttonAddToken: {
    id: 'core.TokenEditDialog.buttonAddToken',
    defaultMessage: 'Add Token',
  },
  buttonDone: {
    id: 'core.TokenEditDialog.buttonDone',
    defaultMessage: 'Done',
  },
  noTokensText: {
    id: 'core.TokenEditDialog.noTokensText',
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
});

interface Props {
  addTokenFn: (address: Address) => Promise<any>;
  cancel: () => void;
  close: () => void;
  nativeTokenAddress?: Address;
  removeTokenFn: (address: Address) => Promise<any>;
  tokens: AnyToken[];
}

interface FormValues {
  tokenAddress: Address;
}

const validationSchema = yup.object({
  tokenAddress: yup
    .string()
    // @ts-ignore
    .address()
    // @todo validate against entering a duplicate address
    .required(),
});

const TokenEditDialog = ({
  addTokenFn,
  tokens = [],
  nativeTokenAddress,
  cancel,
  close,
  removeTokenFn,
}: Props) => {
  const handleSubmit = useCallback(
    async (
      { tokenAddress }: FormValues,
      { resetForm, setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      try {
        await addTokenFn(tokenAddress);
        resetForm();
      } catch (e) {
        setFieldError('tokenAddress', MSG.errorAddingToken);
        setSubmitting(false);
      }
    },
    [addTokenFn],
  );
  return (
    <Dialog cancel={cancel}>
      <DialogSection>
        <Heading
          appearance={{ margin: 'none', size: 'medium' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        <Form
          initialValues={{
            tokenAddress: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, isValid, dirty }: FormikProps<FormValues>) => (
            <>
              <Input label={MSG.fieldLabel} name="tokenAddress" />
              <Button
                disabled={!isValid || isSubmitting || !dirty}
                loading={isSubmitting}
                text={MSG.buttonAddToken}
                type="submit"
              />
            </>
          )}
        </Form>
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        {tokens.length > 0 ? (
          <div className={styles.tokenChoiceContainer}>
            {tokens.map(token => (
              <TokenItem
                key={token.address}
                nativeTokenAddress={nativeTokenAddress}
                removeTokenFn={removeTokenFn}
                token={token}
              />
            ))}
          </div>
        ) : (
          <Heading appearance={{ size: 'normal' }} text={MSG.noTokensText} />
        )}
      </DialogSection>
      <DialogSection appearance={{ align: 'right' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonDone}
          onClick={close}
        />
      </DialogSection>
    </Dialog>
  );
};

TokenEditDialog.displayName = 'core.TokenEditDialog';

export default TokenEditDialog;
