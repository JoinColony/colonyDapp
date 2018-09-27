/* @flow */
import type { FormikProps } from 'formik';
import type { MessageDescriptor } from 'react-intl';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';
import type { DialogType } from '~core/Dialog';

import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './StepCreateColony.css';

import CreatingColony from './CreatingColony.jsx';

type FormValues = {};

type Props = {
  nextStep: () => void,
  previousStep: () => void,
  openDialog: string => DialogType,
} & FormikProps<FormValues>;

type State = {
  isCreatingColony: boolean,
};

type Row = {
  title: MessageDescriptor,
  valueKey: string,
};

type CardProps = {
  cardOptions: Array<Row>,
  values: {},
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
  console.log(values) ||
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

class StepCreateColony extends Component<Props, State> {
  static displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

  constructor(props: Props) {
    super(props);
    this.state = {
      isCreatingColony: false,
    };
  }

  handleColonyCreate = () => {
    // TODO actually create a colony here, and then do something once successful.
    // This is currently just infinitely mocking creation to show the loading screen
    this.setState({ isCreatingColony: true });
  };

  render() {
    const { isCreatingColony } = this.state;
    return (
      <Fragment>
        {isCreatingColony ? (
          <CreatingColony />
        ) : (
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
                onClick={this.handleColonyCreate}
                appearance={{ theme: 'primary' }}
                text={MSG.confirm}
              />
            </div>
          </section>
        )}
      </Fragment>
    );
  }
}

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepCreateColony;
