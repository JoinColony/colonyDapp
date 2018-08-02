/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { SubmitFn } from '../../../core/components/Wizard';

import layout from '~styles/layout.css';
import styles from './StepColonyDetails.css';

import Button from '../../../core/components/Button';
import Heading from '../../../core/components/Heading';
import { FieldSet } from '../../../core/components/Fields';

type FormValues = {
  passphrase: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'CreateColony.StepColonyDetails.heading',
    defaultMessage: 'Create your very own Colony!',
  },
  buttonCreateColony: {
    id: 'CreateColony.StepColonyDetails.button.createColony',
    defaultMessage: 'Create Colony',
  },
  helpText: {
    id: 'CreateColony.StepColonyDetails.helpText',
    defaultMessage: 'So, this is some placeholder text',
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyDetails';

const StepColonyDetails = ({ handleSubmit, isSubmitting }: Props) => (
  <section className={`${styles.main} ${layout.flexContent}`}>
    <header className={styles.header}>
      <Heading appearance={{ size: 'small' }} text={MSG.heading} />
    </header>
    <form onSubmit={handleSubmit}>
      <FieldSet appearance={{ align: 'right' }}>
        <Button
          theme="primary"
          type="submit"
          size="large"
          loading={isSubmitting}
          value={MSG.buttonCreateColony}
        />
      </FieldSet>
    </form>
  </section>
);

StepColonyDetails.displayName = displayName;

export const Step = StepColonyDetails;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const sidebarChild = <FormattedMessage {...MSG.helpText} />;
