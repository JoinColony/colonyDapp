/* @flow */
import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { TokenReferenceType } from '~immutable';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Checkbox, Form, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import { useToken } from '../../../dashboard/hooks';
import { tokenIsETH } from '../../../../immutable/utils';

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

type FormValues = {
  colonyTokens: Array<string>,
};

type Props = {|
  cancel: () => void,
  close: () => void,
  /* Using this only for address and isNative */
  tokens?: Array<TokenReferenceType>,
  /* Addresses of tokens to be selected initially */
  selectedTokens: Array<string>, // address[]
|};

const validateNativeTokenSelect = (nativeToken?: TokenReferenceType): any => {
  if (nativeToken) {
    const { address } = nativeToken;
    return yup.object().shape({
      tokens: yup
        .array()
        .of(yup.string())
        .includes(address, MSG.errorNativeTokenRequired),
    });
  }
  return null;
};

const TokenCheckbox = ({
  address,
  isNative = false,
}: {
  address: string,
  isNative?: boolean,
}) => {
  const token = useToken(address);
  return token ? (
    <Checkbox
      className={styles.tokenChoice}
      value={address}
      name="tokens"
      disabled={isNative || tokenIsETH(token)}
    >
      {!!token.icon && (
        <img
          // TODO: this is cheating, we should load from our own node
          src={`https://ipfs.io/ipfs/${token.icon}`}
          alt={token.name}
          className={styles.tokenChoiceIcon}
        />
      )}
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
  tokens = [],
  selectedTokens = [],
  cancel,
  close,
}: Props) => {
  const nativeToken = tokens.find(token => token.isNative);
  return (
    <Dialog cancel={cancel}>
      <Form
        initialValues={{
          tokens: selectedTokens,
        }}
        onSubmit={close}
        validationSchema={validateNativeTokenSelect(nativeToken)}
      >
        {({ isSubmitting }: FormikProps<FormValues>) => (
          <Fragment>
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
                {tokens.map(({ address, isNative }) => (
                  <TokenCheckbox
                    key={address}
                    address={address}
                    isNative={isNative}
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
          </Fragment>
        )}
      </Form>
    </Dialog>
  );
};

TokenEditDialog.displayName = 'admin.Tokens.TokenEditDialog';

export default TokenEditDialog;
