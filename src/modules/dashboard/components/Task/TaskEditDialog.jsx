/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import nanoid from 'nanoid';

import Assignment, { ItemDefault } from '~core/Assignment';
import Button from '~core/Button';
import Form from '~core/Fields/Form';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from './Payout.jsx';

import userMocks from './__datamocks__/mockUsers';
import taskMock from './__datamocks__/mockTask';

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
    defaultMessage: 'Cancel',
  },
  search: {
    id: 'dashboard.task.taskEditDialog.search',
    defaultMessage: 'Search...',
  },
  selectAssignee: {
    id: 'dashboard.task.taskEditDialog.selectAssignee',
    defaultMessage: 'Select Assignee',
  },
});

type FormValues = {
  amount: Array<string>,
};

type State = {
  payouts: [],
};

type Props = {
  /* This will soon get the current payout array if there's one set already
  passed in as props */
  cancel: () => void,
  close: () => void,
};

const validateFunding = (): any =>
  yup.object({
    amount: yup.number(),
  });

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

class TaskEditDialog extends Component<Props, State> {
  static displayName = 'dashboard.task.taskEditDialog';

  state = {
    payouts: taskMock.payouts,
  };

  handleSubmitFunding = () => {};

  addTokenFunding = () => {
    const { payouts } = this.state;

    this.setState({
      payouts: payouts.concat([{ symbol: '', amount: undefined }]),
    });
  };

  render() {
    const { cancel } = this.props;
    const { payouts } = this.state;

    return (
      <Dialog
        cancel={cancel}
        backdrop={styles.backdrop}
        className={styles.taskDialog}
      >
        <Form
          initialValues={{ payouts }}
          onSubmit={this.handleSubmitFunding}
          validationSchema={validateFunding()}
        >
          {({ isSubmitting, dirty }: FormikProps<FormValues>) => (
            <Fragment>
              <DialogSection appearance={{ border: 'grey' }}>
                <Heading
                  appearance={{ size: 'medium', margin: 'none' }}
                  text={MSG.titleAssignment}
                />
                <Assignment
                  name="assignee"
                  itemComponent={ItemDefault}
                  label={MSG.selectAssignee}
                  data={userMocks}
                  filter={filter}
                  placeholder={MSG.search}
                />
              </DialogSection>
              <DialogSection appearance={{ border: 'grey' }}>
                <div className={styles.taskEditContainer}>
                  <div className={styles.editor}>
                    <Heading
                      appearance={{ size: 'medium' }}
                      text={MSG.titleFunding}
                    />
                    <Button
                      appearance={{ theme: 'blue', size: 'small' }}
                      text={MSG.add}
                      onClick={this.addTokenFunding}
                    />
                  </div>
                  {payouts &&
                    payouts.map((payout, index) => (
                      <Payout
                        key={nanoid(index)}
                        amount={payout.amount}
                        symbol={payout.symbol}
                      />
                    ))}
                </div>
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
                    disabled={!dirty}
                  />
                </div>
              </DialogSection>
            </Fragment>
          )}
        </Form>
      </Dialog>
    );
  }
}

export default TaskEditDialog;
