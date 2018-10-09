/* @flow */

import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';
import type { DialogType } from '~core/Dialog';

import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './StepCreateColony.css';

import CreatingColony from './CreatingColony.jsx';
import CardRow from './CreateColonyCardRow.jsx';

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
  openDialog: string => DialogType,
  createColonyAction: (tokenAddress: string) => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  errorCreateColony: {
    id: 'error.colony.createColony',
    defaultMessage: 'Could not create Colony',
  },
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

class StepCreateColony extends Component<Props> {
  static displayName = 'dashboard.CreateColonyWizard.StepCreateColony';

  componentDidUpdate({
    createColony: {
      isSubmitting: prevIsSubmitting,
      error: prevError,
      colonyAddress: prevColonyAddress,
    },
  }) {
    const {
      createColony: { isSubmitting, error, colonyAddress } = {},
      openDialog,
      setErrors,
      setSubmitting,
    } = this.props;
    if (
      typeof isSubmitting !== 'undefined' &&
      isSubmitting !== prevIsSubmitting
    )
      setSubmitting(isSubmitting);

    if (error && error !== prevError)
      setErrors({ tokenAddress: MSG.errorCreateColony });

    if (colonyAddress && colonyAddress !== prevColonyAddress)
      openDialog('ActivityBarExample');
  }

  handleCreateColony = (e: SyntheticEvent<any>) => {
    e.preventDefault();

    const {
      setSubmitting,
      createColonyAction: createColony,
      values: { tokenAddress },
    } = this.props;

    setSubmitting(true);
    createColony(tokenAddress);
  };

  render() {
    const { values, previousStep, isSubmitting, openDialog } = this.props;
    return (
      <Fragment>
        {isSubmitting ? (
          <CreatingColony openDialog={openDialog} />
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
              <CardRow cardOptions={options} values={values} />
            </div>
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'secondary' }}
                type="cancel"
                text={MSG.back}
                onClick={previousStep}
              />
              <Button
                onClick={this.handleCreateColony}
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

export const Step = connect(
  ({
    dashboard: {
      colony: { createColony },
    },
  }) => ({ createColony }),
  (dispatch: Dispatch) => bindActionCreators({ createColonyAction }, dispatch),
)(StepCreateColony);
