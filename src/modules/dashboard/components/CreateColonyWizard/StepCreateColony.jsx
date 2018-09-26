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

type FormValues = {};

type Props = {
  nextStep: () => void,
  previousStep: () => void,
  openDialog: string => void,
} & FormikProps<FormValues>;

type Row = {
  title: MessageDescriptor,
  valueKey: string,
};

type CardProps = {
  cardOptions: Array<Row>,
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
const mockFormikValues = {
  colonyName: 'Encecladus',
  tokenName: 'Starfleet Token',
  tokenSymbol: 'STRF',
};

const CardRow = ({ cardOptions }: CardProps) =>
  cardOptions.map(option => (
    <div className={styles.cardRow} key={`option ${option.valueKey}`}>
      <Heading
        appearance={{ size: 'normal', weight: 'medium', margin: 'none' }}
        text={option.title}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'thin', margin: 'none' }}
        text={mockFormikValues[option.valueKey]}
      />
    </div>
  ));

class StepCreateColony extends Component<Props> {
  openGasDialog = () => {
    const { openDialog } = this.props;
    openDialog('ActivityBarExample');
  };

  render() {
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
          <CardRow cardOptions={options} />
        </div>
        <div className={styles.buttons}>
          <Button
            appearance={{ theme: 'secondary' }}
            type="cancel"
            text={MSG.back}
          />
          <Button
            onClick={this.openGasDialog}
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

export const Step = StepWithDialog;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
