/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import { isAddress } from 'web3-utils';

import * as yup from 'yup';

import type { FormikProps } from 'formik';

import styles from './StepSelectToken.css';
import Input from '~core/Fields/Input';
import Heading from '~core/Heading';
import Button from '~core/Button';
import FileUpload from '~core/FileUpload';

import type { SubmitFn, WizardFormikBag } from '~core/Wizard';

import {
  TOKEN_INFO_FETCH,
  TOKEN_INFO_FETCH_SUCCESS,
  TOKEN_INFO_FETCH_ERROR,
} from '../../actionTypes/colony';
import promiseListener from '../../../../createPromiseListener';

type TokenData = {
  name: string,
  symbol: string,
};

type FormValues = {
  tokenAddress: string,
  tokenSymbol?: string,
  tokenName?: string,
  iconUpload?: string,
  tokenData: ?TokenData,
};

type State = {
  isLoading: boolean,
  tokenData: ?TokenData,
};

type Props = {
  handleTokenAddressChange: (e: SyntheticEvent<HTMLInputElement>) => void,
  nextStep: () => void,
  previousStep: () => void,
} & FormikProps<FormValues>;

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
class StepSelectToken extends Component<Props, State> {
  getToken: (
    values: FormValues,
    bag: WizardFormikBag<FormValues>,
  ) => Promise<any>;

  static displayName = 'dashboard.CreateColonyWizard.StepSelectToken';

  constructor(props: Props) {
    super(props);
    this.state = { isLoading: false, tokenData: null };
    this.getToken = promiseListener.createAsyncFunction({
      start: TOKEN_INFO_FETCH,
      resolve: TOKEN_INFO_FETCH_SUCCESS,
      reject: TOKEN_INFO_FETCH_ERROR,
    });
  }

  componentDidUpdate({ values: { tokenAddress: prevTokenAddress } }: Props) {
    const {
      values: { tokenAddress },
      isSubmitting,
    } = this.props;
    const { isLoading } = this.state;

    // Guard against updates that don't include a new, valid `tokenAddress`,
    // or if the form is submitting or loading.
    if (
      !(tokenAddress && tokenAddress.length) ||
      tokenAddress === prevTokenAddress ||
      !isAddress(tokenAddress) ||
      isSubmitting ||
      isLoading
    )
      return;

    // For a valid address, attempt to load token info.
    // XXX this is setting state during `componentDidUpdate`, which is
    // generally a bad idea, but we are guarding against it by checking the
    // state first.
    this.setLoading(true);

    // Get the token address and handle success/error
    this.getToken
      .asyncFunction({ tokenAddress })
      .then((...args) => this.handleGetTokenSuccess(...args))
      .catch(error => this.handleGetTokenError(error));
  }

  componentWillUnmount() {
    this.getToken.unsubscribe();
  }

  setLoading(isLoading: boolean) {
    this.setState({ isLoading });
  }

  handleGetTokenSuccess({ name = '', symbol = '' }: TokenData) {
    const { setFieldValue } = this.props;
    // XXX using `setValues` will cause this handler to re-run,
    // so it is easier to set values separately.
    setFieldValue('tokenName', name);
    setFieldValue('tokenSymbol', symbol);

    this.setState({
      isLoading: false,
      tokenData: name.length || symbol.length ? { name, symbol } : null,
    });
  }

  handleGetTokenError(error: Error) {
    const { setFieldValue } = this.props;
    setFieldValue('tokenName', '');
    setFieldValue('tokenSymbol', '');

    this.setState({ isLoading: false, tokenData: null });
    // TODO later: show error feedback
    console.info(error); // eslint-disable-line no-console
  }

  render() {
    const {
      isValid,
      previousStep,
      values: { tokenAddress },
    } = this.props;
    const { isLoading, tokenData } = this.state;
    return (
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
              extra={
                <Button text={MSG.learnMore} appearance={{ theme: 'blue' }} />
              }
              status={tokenData ? MSG.preview : MSG.hint}
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
