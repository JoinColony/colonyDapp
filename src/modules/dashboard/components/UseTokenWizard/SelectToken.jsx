// @flow
import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import ColonyJs from '@colony/colony-js-client';
import * as yup from 'yup';

import { withFormik } from 'formik';
import type { SubmitFn } from '../../../core/components/Wizard';
import type { FileReaderFile } from '../FileUpload';

import styles from './SelectToken.css';

import Input from '../../../core/components/Fields/Input';
import InputLabel from '../../../core/components/Fields/InputLabel';
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
});

const displayName = 'dashboard.CreateColonyWizard.SelectToken';

class SelectToken extends Component<Props, State> {
  state = {
    hasTokenData: false,
  };

  checkToken(tokenAddress) {
    /*
    if (requestFromEtherScan(tokenAddress)) {
      this.setState({ hasTokenData: true });
    }
    */
  }

  render() {
    const { hasTokenData } = this.state;
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
              placeholder="Type a token contact address"
            />
            {!errors.validAddress && (
              <div className={styles.tokenHint}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  type="continue"
                  text={MSG.hint}
                />
              </div>
            )}
            {hasTokenData ? (
              <div className={styles.tokenHint}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  type="continue"
                  text={MSG.preview}
                />
              </div>
            ) : (
              [
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
              ]
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
    console.log('Valid others');

    if (values.tokenAddress.length > 3) {
      errors.existingToken = 'existence';
    }
    return errors;
  },
};

export const validationSchema = yup.object({
  tokenAddress: yup
    .string()
    .required()
    .address(),
});

SelectToken.displayName = displayName;

export const Step = SelectToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
