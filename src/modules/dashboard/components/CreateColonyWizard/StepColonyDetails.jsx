/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { SubmitFn } from '../../../core/components/Wizard';

import styles from './StepColonyDetails.css';

import Input from '../../../core/components/Fields/Input';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const { Formik } = require('formik');

type FormValues = {
  passphrase: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'CreateColony.StepColonyDetails.heading',
    defaultMessage: 'What would you like to name your Colony?',
  },
  labelCreateColony: {
    id: 'CreateColony.StepColonyDetails.label.createColony',
    defaultMessage: 'Colony Name',
  },
  helpText: {
    id: 'CreateColony.StepColonyDetails.helpText',
    defaultMessage: 'So, this is some placeholder text',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyDetails';

const StepColonyDetails = ({ handleSubmit, isSubmitting }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <Formik
        initialValues={{
          colonyName: '',
        }}
        onSubmit={newColonyName => console.log(newColonyName)}
        render={({ handleSubmit }) => (
          <form className={styles.nameForm} onSubmit={handleSubmit}>
            <Input
              name="colonyName"
              label={MSG.labelCreateColony}
              placeholder="Type a display name for a colony"
              appearance={{ width: 'full' }}
            />
            <div className={styles.buttons}>
              <Button appearance={{ theme: 'secondary' }} type="cancel">
                Cancel
              </Button>
              <Button appearance={{ theme: 'primary' }} type="submit">
                Next
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  </section>
);

StepColonyDetails.displayName = displayName;

export const Step = StepColonyDetails;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const sidebarChild = <FormattedMessage {...MSG.helpText} />;
