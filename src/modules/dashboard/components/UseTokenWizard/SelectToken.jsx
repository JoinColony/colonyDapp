// @flow
import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { TokenClient } from '@colony/colony-js-client/src/TokenClient';

import type { SubmitFn } from '../../../core/components/Wizard';

import styles from './SelectToken.css';

import Input from '../../../core/components/Fields/Input';
import InputLabel from '../../../core/components/Fields/InputLabel';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const { Formik } = require('formik');

type FormValues = {
  nextStep: () => void,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

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

class SelectToken extends Component<Props> {
  state = {
    validAddress: false,
  };

  validateAddress = address => {
    console.log('validateAddress()');
    return true;
  };
  // TODO: use purser tomorrow

  checkToken = address => {
    console.log('checkToken()');
    console.log(TokenClient);
    TokenClient.getTokenInfo.call({ address }).then(res => console.log(res));
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <section className={styles.content}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'thin' }}
            text={MSG.heading}
          />
          <Formik
            onSubmit={tokenAddress => {
              if (this.validateAddress(tokenAddress)) {
                return this.checkToken(tokenAddress);
              }
            }}
            render={() => (
              <form className={styles.nameForm} onSubmit={handleSubmit}>
                <div className={styles.labelContainer}>
                  <InputLabel label={MSG.labelCreateColony} />
                  <Button
                    appearance={{ theme: 'blue' }}
                    type="continue"
                    text={MSG.learnMore}
                  />
                </div>
                <Input
                  elementOnly
                  name="SelectToken"
                  placeholder="Type a token contact address"
                  connect={false}
                />
                <div className={styles.tokenHint}>
                  <Button
                    appearance={{ theme: 'secondary' }}
                    type="continue"
                    text={MSG.hint}
                  />
                </div>
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
            )}
          />
        </div>
      </section>
    );
  }
}

SelectToken.displayName = displayName;

export const Step = SelectToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
