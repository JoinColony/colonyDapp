// @flow
import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import ColonyJs from '@colony/colony-js-client';
// import { validators } from '@colony/purser-core';

import { withFormik } from 'formik';
import type { SubmitFn } from '../../../core/components/Wizard';

import styles from './SelectToken.css';

import Input from '../../../core/components/Fields/Input';
import InputLabel from '../../../core/components/Fields/InputLabel';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

type FormValues = {
  nextStep: () => void,
};

type Props = {
  handleSubmit: () => void,
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
  preview: {
    id: 'CreateColony.SelectToken.preview',
    defaultMessage: 'Token Preview',
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

const SelectToken = ({ handleSubmit, errors }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
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
          name="tokenAddress"
          placeholder="Type a token contact address"
        />
        <div className={styles.tokenHint}>
          {!errors.validAddress && (
            <Button
              appearance={{ theme: 'secondary' }}
              type="continue"
              text={MSG.hint}
            />
          )}
          {errors.existingToken ? (
            <Button
              appearance={{ theme: 'secondary' }}
              type="continue"
              text={MSG.preview}
            />
          ) : null}
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
    </div>
  </section>
);

const enhance = compose(
  withFormik({
    mapPropsToValues: () => ({
      tokenAddress: '',
    }),
    validate: (values: FormValues): FormikErrors<FormValues> => {
      const errors = {};
      if (!values.tokenAddress) {
        errors.validAddress = true;
      } else if (values.tokenAddress.length > 3) {
        errors.existingToken = true;
        errors.validAddress = true;
      }
      return errors;
    },
    handleSubmit: (values: FormValues, otherProps: FormikBag<Object, *>) => {
      console.log(values);
    },
  }),
);

SelectToken.displayName = displayName;

export const Step = enhance(SelectToken);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
