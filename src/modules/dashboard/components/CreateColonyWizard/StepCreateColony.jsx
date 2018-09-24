// @flow
import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

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

type CardProps = {
  options: Array<{
    title: string,
    valueKey: string,
  }>,
};

const MSG = defineMessages({
  title: {
    id: 'CreateColony.StepCreateColony.title',
    defaultMessage: `Almost there! Confirm your details`,
  },
  subtitle: {
    id: 'CreateColony.StepCreateColony.subtitle',
    defaultMessage: `and create your new Colony.`,
  },
  confirm: {
    id: 'CreateColony.StepCreateColony.confirmButton',
    defaultMessage: `Create Colony`,
  },
  back: {
    id: 'CreateColony.StepCreateColony.backButton',
    defaultMessage: `Back`,
  },
  colonyName: {
    id: 'CreateColony.StepCreateColony.colonyName',
    defaultMessage: `Colony Name`,
  },
  tokenName: {
    id: 'CreateColony.StepCreateColony.tokenName',
    defaultMessage: `Token Name`,
  },
  tokenSymbol: {
    id: 'CreateColony.StepCreateColony.tokenSymbol',
    defaultMessage: `Token Symbol`,
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

const options = [
  {
    title: MSG.colonyName,
    valueKey: 'colonyName',
  },
  {
    title: MSG.tokenName,
    valueKey: 'tokenName',
  },
  {
    title: MSG.tokenSymbol,
    valueKey: 'tokenSymbol',
  },
];

// TODO: Once we wire this step up with the previous
// steps all we need to do is getting the "values"
// prop from Formik and pass it throught to the CardRow component
const values = {
  colonyName: 'Encecladus',
  tokenName: 'Starfleet Token',
  tokenSymbol: 'STRF',
};

// To allow us to pass these through to the next step easily using Formik
// we make values that have to be confirmed in this screen the input fields
const CardRow = ({ options }: CardsProps) =>
  options.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey}`}>
      <Heading
        appearance={{ size: 'normal', weight: 'medium', margin: 'none' }}
        text={option.title}
      />
      <Input
        elementOnly
        readOnly
        className={styles.fakeInput}
        value={values[option.valueKey]}
        name={option.valueKey}
      />
    </div>
  ));

const StepCreateColony = ({ handleSubmit }: Props) => (
  <section className={styles.content}>
    <form onSubmit={handleSubmit}>
      <div className={styles.finalForm}>
        <Heading
          appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
          text={MSG.title}
        />
        <Heading
          appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
          text={MSG.subtitle}
        />
        <CardRow options={options} />
      </div>
      <div className={styles.buttons}>
        <Button
          appearance={{ theme: 'secondary' }}
          type="cancel"
          text={MSG.back}
        />
        <Button
          appearance={{ theme: 'primary' }}
          type="submit"
          text={MSG.confirm}
        />
      </div>
    </form>
  </section>
);

StepCreateColony.displayName = displayName;

export const Step = StepCreateColony;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
