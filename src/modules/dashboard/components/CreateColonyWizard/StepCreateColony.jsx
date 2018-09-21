// @flow
import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import type { SubmitFn } from '../../../core/components/Wizard';

import styles from './StepCreateColony.css';

import Input from '../../../core/components/Fields/Input';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

type FormValues = {
  nextStep: () => void,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  title: {
    id: 'CreateColony.StepCreateColony.title',
    defaultMessage: `Almost there! Confirm your details`,
  },
  subtitle: {
    id: 'CreateColony.StepCreateColony.subtitle',
    defaultMessage: `and create your new Colony.`,
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

const StepCreateColony = ({ handleSubmit }: Props) => (
  <section className={styles.content}>
    <div className={styles.title}>
      <form className={styles.finalForm} onSubmit={handleSubmit}>
        <Heading
          appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
          text={MSG.title}
        />
        <Heading
          appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
          text={MSG.subtitle}
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
    </div>
  </section>
);

StepCreateColony.displayName = displayName;

export const Step = StepCreateColony;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const sidebarChild = <FormattedMessage {...MSG.helpText} />;
