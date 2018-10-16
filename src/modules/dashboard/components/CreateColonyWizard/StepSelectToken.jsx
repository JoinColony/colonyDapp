/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import { isAddress } from 'web3-utils';

import * as yup from 'yup';
import MakeAsyncFunction from 'react-redux-promise-listener';

import type { FormikProps } from 'formik';

import styles from './StepSelectToken.css';
import Input from '~core/Fields/Input';
import Heading from '~core/Heading';
import Button from '~core/Button';
import FileUpload from '~core/FileUpload';

import type { SubmitFn } from '~core/Wizard';

import {
  GET_TOKEN_INFO,
  GET_TOKEN_INFO_SUCCESS,
  GET_TOKEN_INFO_ERROR,
} from '../../actionTypes/colony';
import promiseListener from '../../../../createPromiseListener';

type FormValues = {
  tokenAddress: string,
  tokenSymbol?: string,
  tokenName?: string,
  iconUpload?: string,
  tokenData: {
    name: string,
    symbol: string,
  } | null,
};

type State = {
  isLoading: boolean,
  tokenData: ?{
    symbol: string,
    name: string,
  },
};

type Props = {
  handleTokenAddressChange: (e: SyntheticEvent<HTMLInputElement>) => void,
  nextStep: () => void,
  previousStep: () => void,
} & State &
  FormikProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.heading',
    defaultMessage: 'Select an existing ERC20 Token',
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.label',
    defaultMessage: 'Token Contact Address',
  },
  learnMore: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.learnMore',
    defaultMessage: 'Learn More',
  },
  hint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.hint',
    defaultMessage: 'You can find them here https://etherscan.io/tokens',
  },
  symbolHint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.symbolHint',
    defaultMessage: 'Max of 6 characters',
  },
  preview: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.preview',
    defaultMessage: 'Token Preview: {tokenName} ({tokenSymbol})',
  },
  tokenName: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.tokenName',
    defaultMessage: 'Token Name',
  },
  tokenSymbol: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.tokenSymbol',
    defaultMessage: 'Token Symbol',
  },
  cancel: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.next',
    defaultMessage: 'Next',
  },
  invalidAddress: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.invalidAddress',
    defaultMessage:
      'Not a valid token address. Check: https://etherscan.io/tokens',
  },
  fileUploadTitle: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.fileUpload',
    defaultMessage: 'Token Icon (.svg or .png)',
  },
  fileUploadHint: {
    id: 'dashboard.CreateColonyWizard.StepSelectToken.fileUploadHint',
    defaultMessage: 'Recommended size for .png file is 60px by 60px, up to 1MB',
  },
});

export const validationSchema = yup.object({
  tokenAddress: yup.string().address(MSG.invalidAddress),
  tokenSymbol: yup.string().max(6),
  tokenName: yup.string(),
});

// TODO in #453 - show inputs for minimal ERC20 contracts
const StepSelectTokenForm = ({
  handleTokenAddressChange,
  isLoading,
  isValid,
  previousStep,
  tokenData,
  values: { tokenAddress },
}: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <div className={styles.nameForm}>
        <Input
          name="tokenAddress"
          label={MSG.label}
          extra={<Button text={MSG.learnMore} appearance={{ theme: 'blue' }} />}
          status={tokenData ? MSG.preview : MSG.hint}
          onChange={handleTokenAddressChange}
          statusValues={
            tokenData
              ? { tokenName: tokenData.name, tokenSymbol: tokenData.symbol }
              : {}
          }
        />
        {!tokenData &&
          !isLoading &&
          tokenAddress && (
            <Fragment>
              <div className={styles.tokenDetails}>
                <Input name="tokenName" label={MSG.tokenName} />
              </div>
              <div className={styles.tokenDetails}>
                <Input
                  name="tokenSymbol"
                  label={MSG.tokenSymbol}
                  hint={
                    <Heading
                      appearance={{ size: 'small', weight: 'thin' }}
                      text={MSG.symbolHint}
                    />
                  }
                />
              </div>
              <div className={styles.tokenDetails}>
                <FileUpload
                  accept={['svg', 'png']}
                  label={MSG.fileUploadTitle}
                  name="iconUpload"
                  status={MSG.fileUploadHint}
                  maxFilesLimit={1}
                />
              </div>
            </Fragment>
          )}
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'secondary' }}
            type="cancel"
            text={MSG.cancel}
            onClick={previousStep}
          />
          <Button
            appearance={{ theme: 'primary' }}
            type="submit"
            disabled={!isValid}
            text={MSG.next}
          />
        </div>
      </div>
    </div>
  </section>
);

class StepSelectToken extends Component<Props, State> {
  static displayName = 'dashboard.CreateColonyWizard.StepSelectToken';

  constructor(props: Props) {
    super(props);
    this.state = { isLoading: false, tokenData: null };
  }

  render() {
    const { handleChange, isSubmitting, setFieldValue } = this.props;
    const { isLoading, tokenData } = this.state;
    return (
      <MakeAsyncFunction
        listener={promiseListener}
        start={GET_TOKEN_INFO}
        resolve={GET_TOKEN_INFO_SUCCESS}
        reject={GET_TOKEN_INFO_ERROR}
        setPayload={(action: *, tokenAddress: *) => ({
          ...action,
          payload: { tokenAddress },
        })}
      >
        {asyncFunc => {
          // Handle changes to the `tokenAddress field.
          const handleTokenAddressChange = event => {
            // Immediately let formik handle the event.
            handleChange(event);

            // If the form is submitting or we're loading token info,
            // nothing more to do here.
            if (isSubmitting || isLoading) return;

            // Get the current `tokenAddress` value from the event.
            const {
              currentTarget: { value: tokenAddress },
            } = event;

            // For a valid address, attempt to load token info.
            if (isAddress(tokenAddress)) {
              this.setState({ isLoading: true });

              // Call the async function we created (dispatches `start` action).
              asyncFunc(tokenAddress).then(
                ({ name = '', symbol = '' }) => {
                  // XXX using `setValues` will cause this handler to re-run,
                  // so it is easier to set values separately.
                  setFieldValue('tokenName', name);
                  setFieldValue('tokenSymbol', symbol);
                  this.setState({
                    isLoading: false,
                    tokenData:
                      name.length || symbol.length ? { name, symbol } : null,
                  });
                },
                error => {
                  setFieldValue('tokenName', '');
                  setFieldValue('tokenSymbol', '');
                  this.setState({ isLoading: false, tokenData: null });
                  // TODO later: show error feedback
                  console.info(error); // eslint-disable-line no-console
                },
              );
            }
          };
          return (
            <StepSelectTokenForm
              {...this.props}
              handleTokenAddressChange={handleTokenAddressChange}
              isLoading={isLoading}
              tokenData={tokenData}
            />
          );
        }}
      </MakeAsyncFunction>
    );
  }
}

export const Step = StepSelectToken;

export const onSubmit: SubmitFn<FormValues> = (
  { tokenAddress },
  { nextStep, setFieldValue },
) => {
  setFieldValue('tokenAddress', tokenAddress);
  nextStep();
};
