// @flow
import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { SubmitFn } from '../../../core/components/Wizard';

import styles from './StepCreateToken.css';

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
    id: 'CreateColony.CreateToken.heading',
    defaultMessage: 'Lets create your new token',
  },
  labelCreateColony: {
    id: 'CreateColony.CreateToken.label.createColony',
    defaultMessage: 'Token Contact Address',
  },
  helpText: {
    id: 'CreateColony.CreateToken.learnMore',
    defaultMessage: 'Learn More',
  },
  hint: {
    id: 'CreateColony.CreateToken.hint',
    defaultMessage: 'You can find them here https://etherscan.io/tokens',
  },
  cancel: {
    id: 'CreateColony.CreateToken.back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'CreateColony.CreateToken.next',
    defaultMessage: 'Next',
  },
});

const displayName = 'dashboard.CreateColonyWizard.CreateToken';

const CreateToken = ({ handleSubmit }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <Formik
        initialValues={{ tokenAddress: '' }}
        onSubmit={tokenAddress => console.log(tokenAddress)}
        render={() => (
          <form className={styles.nameForm} onSubmit={handleSubmit}>
            <InputLabel label={MSG.labelCreateColony} />
            <Input
              name="colonyName"
              placeholder="Type a display name for a colony"
              appearance={{ width: 'full' }}
            />
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

CreateToken.displayName = displayName;

export const Step = CreateToken;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
