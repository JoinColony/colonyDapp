/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Form from '~core/Fields/Form';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';

import styles from './TaskEditDialog.css';

const MSG = defineMessages({
  titleAssignment: {
    id: 'dashboard.task.taskEditDialog.titleAssignment',
    defaultMessage: 'Assignment',
  },
  titleFunding: {
    id: 'dashboard.task.taskEditDialog.titleFunding',
    defaultMessage: 'Funding',
  },
  add: {
    id: 'dashboard.task.taskEditDialog.add',
    defaultMessage: 'Add +',
  },
  amount: {
    id: 'dashboard.task.taskEditDialog.amount',
    defaultMessage: 'Amount',
  },
  modify: {
    id: 'dashboard.task.taskEditDialog.modify',
    defaultMessage: 'Modify',
  },
  notSet: {
    id: 'dashboard.task.taskEditDialog.notSet',
    defaultMessage: 'Not set',
  },
  buttonConfirm: {
    id: 'dashboard.task.taskEditDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
  buttonCancel: {
    id: 'dashboard.task.taskEditDialog.buttonCancel',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  amount: Array<string>,
};

type Payout = {};

type Props = {
  cancel: () => void,
  close: () => void,
  payouts: Array<Payout>,
};

const validateFunding = (): any =>
  yup.object({
    amount: yup.number(),
  });

class TokenEditDialog extends Component<Props> {
  static displayName = 'dashboard.task.taskEditDialog';

  static defaultProps = {
    payouts: [],
  };

  handleSubmitFunding = () => {};

  render() {
    const { payouts, cancel } = this.props;
    return (
      <Dialog cancel={cancel} backdrop={styles.backdrop}>
        <Form
          initialValues={{ payouts }}
          onSubmit={this.handleSubmitFunding}
          validationSchema={validateFunding()}
        >
          {({ isSubmitting }: FormikProps<FormValues>) => (
            <Fragment>
              <DialogSection appearance={{ border: 'grey' }}>
                <Heading
                  appearance={{ size: 'normal', margin: 'none' }}
                  text={MSG.titleAssignment}
                />
              </DialogSection>
              <DialogSection appearance={{ border: 'grey' }}>
                <div className={styles.taskEditContainer}>
                  <div className={styles.editor}>
                    <Heading
                      appearance={{ size: 'normal' }}
                      text={MSG.titleFunding}
                    />
                    <Button
                      appearance={{ theme: 'blue', size: 'small' }}
                      text={MSG.add}
                    />
                  </div>
                  <div className={styles.amountEditor}>
                    <Heading appearance={{ size: 'small' }} text={MSG.amount} />
                    <FormattedMessage {...MSG.notSet}/>
                    <Button
                      appearance={{ theme: 'blue', size: 'small' }}
                      text={MSG.modify}
                    />
                  </div>
                </div>
              </DialogSection>
              <div className={styles.buttonContainer}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={MSG.buttonCancel}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  loading={isSubmitting}
                  text={MSG.buttonConfirm}
                  type="submit"
                />
              </div>
            </Fragment>
          )}
        </Form>
      </Dialog>
    );
  }
}

export default TokenEditDialog;
