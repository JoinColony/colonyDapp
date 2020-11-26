import React, { useCallback, useState } from 'react';
import { FormikProps, FormikHelpers, FormikBag } from 'formik';

import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { $PropertyType } from 'utility-types';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, Textarea } from '~core/Fields';
import Heading from '~core/Heading';
import { AnyToken, OneToken } from '~data/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import Paragraph from '~core/Paragraph';
import TokenSelector from '~dashboard/CreateColonyWizard/TokenSelector';

import TokenItem from './TokenItem/index';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.TokenEditDialog.title',
    defaultMessage: 'Manage tokens',
  },
  errorAddingToken: {
    id: 'core.TokenEditDialog.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
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
    defaultMessage: `If token is not listed above, please add any ERC20 compatibile token contract address below.`,
  },
});

interface Props {
  addTokenFn: (address: Address) => Promise<any>;
  cancel: () => void;
  close: () => void;
  tokens: AnyToken[];
}

type Bag = FormikBag<object, FormValues>;
type SetFieldValue = $PropertyType<Bag, 'setFieldValue'>;

interface FormValues {
  tokenAddress: Address;
  description?: string;
}

const validationSchema = yup.object({
  tokenAddress: yup
    .string()
    .address()
    // @todo validate against entering a duplicate address
    .required(),
  tokenSymbol: yup.string().max(6),
});

const TokenEditDialog = ({
  addTokenFn,
  tokens = [],
  cancel,
  close,
}: Props) => {
  const { formatMessage } = useIntl();
  const [tokenData, setTokenData] = useState<OneToken | undefined>();

  const handleTokenSelect = (token: OneToken) => {
    setTokenData(token);
  };

  const handleSubmit = useCallback(
    async (
      { tokenAddress }: FormValues,
      { resetForm, setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      try {
        await addTokenFn(createAddress(tokenAddress));
        resetForm();
        close();
      } catch (e) {
        setFieldError('tokenAddress', formatMessage(MSG.errorAddingToken));
        setSubmitting(false);
      }
    },
    [addTokenFn, formatMessage, close],
  );
  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        {tokens.length > 0 ? (
          <div className={styles.tokenChoiceContainer}>
            {tokens.map((token) => (
              <TokenItem
                key={token.address}
                token={token}
              />
            ))}
          </div>
        ) : (
          <Heading appearance={{ size: 'normal' }} text={MSG.noTokensText} />
        )}
      </DialogSection>
      <Form
        initialValues={{
          tokenAddress: '',
          description: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          isSubmitting,
          isValid,
          dirty,
          values,
        }: FormikProps<FormValues>) => (
          <>
            <DialogSection>
              <Paragraph className={styles.description}>
                <FormattedMessage {...MSG.notListedToken} />
              </Paragraph>
              <TokenSelector
                tokenAddress={values.tokenAddress}
                onTokenSelect={(token: OneToken) => handleTokenSelect(token)}
                tokenData={tokenData}
                label={MSG.fieldLabel}
                appearance={{ colorSchema: 'grey' }}
              />
              <div className={styles.textarea}>
                <Textarea
                  appearance={{
                    colorSchema: 'grey',
                    resizable: 'vertical',
                  }}
                  label={MSG.textareaLabel}
                  name="description"
                  maxLength={4000}
                />
              </div>
            </DialogSection>
            <DialogSection appearance={{ align: 'right' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={{ id: 'button.cancel' }}
                onClick={close}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={{ id: 'button.confirm' }}
                loading={isSubmitting}
                disabled={!isValid || isSubmitting || !dirty}
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
