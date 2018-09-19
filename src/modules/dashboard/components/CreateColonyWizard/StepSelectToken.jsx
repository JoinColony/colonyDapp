// @flow

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import ColonyNetworkClient from '@colony/colony-js-client';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { providers } from 'ethers';
import { EtherscanLoader } from '@colony/colony-js-contract-loader-http';
import * as yup from 'yup';

import type { FormikProps } from 'formik';

import styles from './StepSelectToken.css';
import Input from '../../../core/components/Fields/Input';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import FileUpload from '../../../core/components/FileUpload';

import type { SubmitFn } from '../../../core/components/Wizard';

type FormValues = {
  nextStep: () => void,
};

type Props = {
  handleSubmit: () => void,
  previousStep: () => void,
} & FormikProps<FormValues>;

type State = {
  tokenDataNotFound: boolean,
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
  symbolHint: {
    id: 'CreateColony.SelectToken.symbolHint',
    defaultMessage: 'Max of 6 characters',
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
  invalidAddress: {
    id: 'CreateColony.SelectToken.invalidAddress',
    defaultMessage:
      'Not a valid token address. Check: https://etherscan.io/tokens',
  },
  fileUploadTitle: {
    id: 'CreateColony.SelectToken.fileUpload',
    defaultMessage: 'Token Icon (.svg or .png)',
  },
  fileUploadHint: {
    id: 'CreateColony.SelectToken.fileUploadHint',
    defaultMessage: 'Recommended size for .png file is 60px by 60px, up to 1MB',
  }
});

const displayName = 'dashboard.CreateColonyWizard.SelectToken';

class SelectToken extends Component<Props, State> {
  state = {
    tokenDataNotFound: false,
  };

  componentDidMount() {
    this.adapter = new EthersAdapter({
      loader: new EtherscanLoader(),
      provider: new providers.EtherscanProvider(),
    });
  }

  componentDidUpdate({ values: { tokenAddress: previousAddress } }) {
    const {
      values: { tokenAddress },
      isValid,
    } = this.props;

    if (tokenAddress !== previousAddress && isValid) {
      this.intervalId = setInterval(() => {
        this.checkToken(tokenAddress)
          .then(res => {
            //TODO: Get correct Etherscan response for exisiting token

            MSG.preview = +res.name;
            this.setState({ tokenDataNotFound: true });
          })
          .catch(() => {
            this.setState({ tokenDataNotFound: true });
          });
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
    const { tokenDataNotFound } = this.state;
    const { handleSubmit, isValid, previousStep } = this.props;

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
              hint={
                <Button text={MSG.learnMore} appearance={{ theme: 'blue' }} />
              }
              status={MSG.hint}
            />
            {tokenDataNotFound ? (
              <React.Fragment>
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
                  />
                </div>
              </React.Fragment>
            ) : (
              <Heading appearance={{ theme: 'secondary' }} text={MSG.preview} />
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
          </form>
        </div>
      </section>
    );
  }
}

export const validationSchema = yup.object({
  tokenAddress: yup
    .string()
    .required()
    .address(MSG.invalidAddress),
  tokenSymbol: yup.string().max(6),
  tokenName: yup.string(),
});

SelectToken.displayName = displayName;

export const Step = SelectToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
