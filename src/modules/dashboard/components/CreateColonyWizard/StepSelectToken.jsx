// @flow
import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import ColonyNetworkClient from '@colony/colony-js-client';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { providers } from 'ethers';
import { EtherscanLoader } from '@colony/colony-js-contract-loader-http';
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

  componentDidMount() {
    this.adapter = new EthersAdapter({
      loader: new EtherscanLoader(),
      provider: new providers.EtherscanProvider(),
    });
  }

  componentDidUpdate({ values: { tokenAddress: previousAddress } }) {
    // TODO: wrap in an interval to not call more often than once a second

    const {
      values: { tokenAddress },
      isValid,
    } = this.props;

    if (tokenAddress !== previousAddress && isValid) {
      this.checkToken(tokenAddress)
        .then(res => {
          console.log(res);
        })
        .catch(error => console.log(error));
    }
  }

  checkToken = async tokenAddress => {

    const token = new ColonyNetworkClient.TokenClient({
      adapter: this.adapter,
      query: { contractAddress: tokenAddress },
    });
    await token.init();
    return token;
  };

  render() {
    const { hasTokenData } = this.state;
    const { handleSubmit, errors, touched, isValid, values } = this.props;

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
