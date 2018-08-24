/* @flow */
import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { SubmitFn } from '../../../core/components/Wizard';

import styles from './StepProfileCreate.css';

import Input from '../../../core/components/Fields/Input';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const MSG = defineMessages({
  heading: {
    id: 'ProfileCreate.heading',
    defaultMessage: 'Congrats, your wallet is all set up.',
  },
  subHeading: {
    id: 'ProfileCreate.subHeading',
    defaultMessage: `Let's finish your account!`,
  },
  instructionText: {
    id: 'ProfileCreate.instructionText',
    defaultMessage: 'Add a name so people can identify you within Colony.',
  },
  inputLabel: {
    id: 'ProfileCreate.inputLabel',
    defaultMessage: 'Your name',
  },
  buttonAdvance: {
    id: 'ProfileCreate.buttonAdvance',
    defaultMessage: 'Launch App',
  },
  buttonBack: {
    id: 'ProfileCreate.buttonBack',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  profilename: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const StepProfileCreate = ({ handleSubmit, isValid, previousStep }: Props) => (
  <form className={styles.content} onSubmit={handleSubmit}>
    <div className={styles.title}>
      <Heading
        text={MSG.heading}
        appearance={{ size: 'medium', margin: 'none', weight: 'thin' }}
      />
    </div>
    <div className={styles.subTitle}>
      <Heading
        text={MSG.subHeading}
        appearance={{ size: 'medium', weight: 'thin' }}
      />
    </div>
    <div className={styles.instructionText}>
      <Heading
        text={MSG.instructionText}
        appearance={{ size: 'small', weight: 'thin' }}
      />
    </div>
    <Input name="name" label={MSG.inputLabel} />
    <div className={styles.actionsContainer}>
      <Button
        text={MSG.buttonBack}
        appearance={{ theme: 'secondary' }}
        onClick={previousStep}
      />
      <Button text={MSG.buttonAdvance} type="submit" disabled={!isValid} />
    </div>
  </form>
);

export const Step = StepProfileCreate;

export const validationSchema = yup.object({
  name: yup.string().required(),
});

// TODO: submit function
export const onSubmit: SubmitFn<FormValues> = () => null;
