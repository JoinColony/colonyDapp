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
  tokenAddress: string,
  // iconUpload: <any>,
};

type FormValidation = {
  tokenAddress: string,
  // iconUpload: <any>,
} & FormValues;

type Values = { [string]: { [?string]: [string] } };

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
  },
});

const displayName = 'dashboard.CreateColonyWizard.SelectToken';

class SelectToken extends Component<Props, State> {
  state = {
    tokenDataNotFound: false,
  };

  componentDidMount() {
    const provider = new providers.EtherscanProvider();
    this.adapter = new EthersAdapter({
      loader: new EtherscanLoader(),
      provider,
      /* The wallet property is not really required here I heard,
      maybe it could be made optional */
      // $FlowFixMe
      wallet: { provider },
    });
  }

  componentDidUpdate({ values: { tokenAddress: previousAddress } }: Values) {
    const {
      values: { tokenAddress },
      isValid,
    } = this.props;
    if (tokenAddress !== previousAddress && isValid) {
      this.throttle(
        this.checkToken(tokenAddress)
          .then(({ name: tokenName, symbol: tokenSymbol }) => {
            MSG.hint.defaultMessage = `TokenPreview:
              ${tokenName}
              (${tokenSymbol})`;
            this.setState({ tokenDataNotFound: false });
          })
          .catch(error => {
            /* We might want to keep this log for a little while
            for debugging purposes */
            // eslint-disable-next-line no-console
            console.log(error);
            this.setState({ tokenDataNotFound: true });
          }),
        1000,
      );
    }
  }

  adapter = undefined;

  checkToken = async (contractAddress: string) => {
    const token = new ColonyNetworkClient.TokenClient({
      adapter: this.adapter,
      query: { contractAddress },
    });
    await token.init();
    return token.getTokenInfo.call();
  };

  // We could either add the throttle funciton to a collection of helper
  // function on the longterm or decide we use a library
  throttle = (callback: Promise<any>, wait: number) => {
    let timeout = null;
    let callbackArgs: ?Array<any> = null;

    const later = () => {
      // $FlowFixMe
      callback.apply(this, callbackArgs);
      timeout = null;
    };

    return (...args: Array<any>) => {
      if (!timeout) {
        callbackArgs = args;
        timeout = setTimeout(later, wait);
      }
    };
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
                    maxFilesLimit={1}
                  />
                </div>
              </React.Fragment>
            ) : null}
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
  tokenAddress: yup.string().address(MSG.invalidAddress),
  tokenSymbol: yup.string().max(6),
  tokenName: yup.string(),
});

SelectToken.displayName = displayName;

export const Step = SelectToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
