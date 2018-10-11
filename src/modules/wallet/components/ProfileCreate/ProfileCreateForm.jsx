/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import styles from './ProfileCreateForm.css';

import type { FormValues } from './types';

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

type Props = {
  handleBack: () => void,
} & FormikProps<FormValues>;

const ProfileCreateForm = ({ handleBack, isValid }: Props) => (
  <main className={styles.content}>
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
    <Input name="profilename" label={MSG.inputLabel} />
    <div className={styles.actionsContainer}>
      <Button
        text={MSG.buttonBack}
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={handleBack}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={MSG.buttonAdvance}
        type="submit"
        disabled={!isValid}
      />
    </div>
  </main>
);

export const validationSchema = yup.object({
  profilename: yup.string().required(),
});

export default ProfileCreateForm;
