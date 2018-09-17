// @flow
import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import ColonyJs from '@colony/colony-js-client';
import * as yup from 'yup';

import type { SubmitFn } from '../../../core/components/Wizard';
import type { FileReaderFile } from '../FileUpload';

import styles from './StepSelectToken.css';

import Input from '../../../core/components/Fields/Input';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import FileUpload from '../../../core/components/FileUpload';

type FormValues = {
  nextStep: () => void,
};

type Props = {
  handleSubmit: () => void,
  previousStep: () => void,
} & FormikProps<FormValues>;

type State = {
  hasTokenData: boolean,
};

const MSG = defineMessages({
  heading: {
    id: 'CreateColony.SelectToken.heading',
    defaultMessage: 'Select an existing ERC20 Token',
  },
  labelCreateColony: {
    id: 'CreateColony.SelectToken.label.createColony',
    defaultMessage: 'Token Contact Address',
  },
  learnMore: {
    id: 'CreateColony.SelectToken.learnMore',
    defaultMessage: 'Learn More',
  },
  hint: {
    id: 'CreateColony.SelectToken.hint',
    defaultMessage: 'You can find them here https://etherscan.io/tokens',
  },
  preview: {
    id: 'CreateColony.SelectToken.preview',
    defaultMessage: 'Token Preview',
  },
  tokenName: {
    id: 'CreateColony.SelectToken.tokenName',
    defaultMessage: 'Token Name',
  },
  tokenSymbol: {
    id: 'CreateColony.SelectToken.tokenSymbol',
    defaultMessage: 'Token Symbol',
  },
  cancel: {
    id: 'CreateColony.SelectToken.back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'CreateColony.SelectToken.next',
    defaultMessage: 'Next',
  },
  placeholderTokenAddress: {
    id: 'CreateColony.SelectToken.tokenPlaceholder',
    defaultMessage: 'Type a token contract address',
  },
});

const displayName = 'dashboard.CreateColonyWizard.SelectToken';

class SelectToken extends Component<Props, State> {
  state = {
    hasTokenData: false,
  };

  componentDidUpdate() {
    console.log(this.state);
    console.log(this.props);
  }

  checkToken = tokenAddress => {
    /*
    if (requestFromEtherScan(tokenAddress)) {
      this.setState({ hasTokenData: true });
    }
    */
  };

  render() {
    const { hasTokenData } = this.state;
    const { handleSubmit, errors, touched, isValid } = this.props;

    return (
      <section className={styles.content}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'thin' }}
            text={MSG.heading}
          />
          <form className={styles.nameForm} onSubmit={handleSubmit}>
            <Input
              name="tokenAddress"
              label={MSG.labelCreateColony}
              placeholder={MSG.placeholderTokenAddress}
            />
            <Heading
              appearance={{ size: 'small', weight: 'thin' }}
              text={MSG.hint}
            />
            {!hasTokenData ? (
              <Heading
                appearance={{ theme: 'secondary' }}
                type="continue"
                text={MSG.preview}
              />
            ) : (
              <React.Fragment>
                <Input
                  name="tokenName"
                  label={MSG.tokenName}
                  placeholder="Type a token name"
                />,
                <Input
                  name="tokenSymbol"
                  label={MSG.tokenSymbol}
                  placeholder="Type a token symbol"
                />,
              </React.Fragment>
            )}
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'secondary' }}
                type="cancel"
                text={MSG.cancel}
              />
              <Button
                appearance={{ theme: 'primary' }}
                type="submit"
                text={MSG.next}
              />
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export const formikConfig = {
  mapPropsToValues: props => ({ tokenAddress: '' }),
  validate: (values: FormValues): FormikErrors<FormValues> => {
    const errors = {};
    return errors;
  },
};

export const validationSchema = yup.object({
  tokenAddress: yup
    .string()
    .required()
    .address(),
  tokenSymbol: yup.string().max(6, 'Too Long!'),
  tokenName: yup.string(),
});

SelectToken.displayName = displayName;

export const Step = SelectToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
