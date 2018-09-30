// @flow
import type { FormikProps } from 'formik';
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';

import styles from './StepCreateColony.css';

import Heading from '~core/Heading';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';

import { withBoundActionCreators } from '~utils/redux';

import {
  // comment to line break for eslint
  createColony as createColonyAction,
} from '../../actionCreators/colony';

type FormValues = {
  tokenAddress: string,
  tokenCreated: boolean,
};

type Props = {
  nextStep: () => void,
  previousStep: () => void,
  openDialog: string => void,
  createColonyAction: (
    tokenAddress: string,
    setErrors: *,
    setSubmitting: *,
    handleColonyCreated: *,
  ) => void,
} & FormikProps<FormValues>;

type Row = {
  title: MessageDescriptor,
  valueKey: string,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: FormValues,
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

const CardRow = ({ cardOptions, values }: CardProps) =>
  cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey}`}>
      <Heading
        appearance={{ size: 'normal', weight: 'medium', margin: 'none' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}
        text={values[option.valueKey]}
      />
    </div>
  ));

class StepCreateColony extends Component<Props> {
  createColony = () => {
    const {
      openDialog,
      createColonyAction: createColony,
      values: { tokenAddress },
      setErrors,
      setSubmitting,
    } = this.props;

    createColony(
      tokenAddress,
      // eslint-disable-next-line no-unused-vars
      (message: MessageDescriptor) => setErrors({}), // TODO: handle errors
      setSubmitting,
      () => openDialog('ActivityBarExample'),
    );
  };

  render() {
    const { values, previousStep } = this.props;
    return (
      <section className={styles.content}>
        <div className={styles.finalContainer}>
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.title}
          />
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.subtitle}
          />
          <CardRow cardOptions={options} values={values} />
        </div>
        <div className={styles.buttons}>
          {!values.tokenCreated && (
            <Button
              appearance={{ theme: 'secondary' }}
              type="cancel"
              text={MSG.back}
              onClick={previousStep}
            />
          )}
          <Button
            onClick={this.createColony}
            appearance={{ theme: 'primary' }}
            text={MSG.confirm}
          />
        </div>
      </section>
    );
  }
}

StepCreateColony.displayName = displayName;

const StepWithDialog = withDialog()(StepCreateColony);

export const Step = withBoundActionCreators({ createColonyAction })(
  StepWithDialog,
);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
