/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import nanoid from 'nanoid';

import Assignment, { ItemDefault } from '~core/Assignment';
import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import { string } from 'postcss-selector-parser';
import Payout from './Payout.jsx';
import DialogBox from '~core/Dialog/DialogBox.jsx';

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
  yup.object().shape({
    payouts: yup.array().of(
      yup.object().shape({
        symbol: yup.number().required(),
        amount: yup.number().required(),
      }),
    ),
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

  addTokenFunding = () => {
    const { payouts } = this.state;

    this.setState({
      payouts: payouts.concat([{ symbol: '', amount: undefined }]),
    });
  };

  render() {
    const { cancel } = this.props;
    const { payouts } = this.state;
    const { reputation } = taskMock;

    return (
      <FullscreenDialog cancel={cancel}>
        <ActionForm
          submit="CREATE_COOL_THING"
          success="COOL_THING_CREATED"
          error="COOL_THING_CREATE_ERROR"
          initialValues={{ payouts }}
          validationSchema={validateFunding()}
        >
          {({ isSubmitting, dirty }: FormikProps<FormValues>) => (
            <Fragment>
              <DialogBox>
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
                      payouts.map((payout, index) => {
                        const { amount, symbol, isNative, isEth } = payout;
                        return (
                          <Payout
                            key={nanoid(index)}
                            amount={amount}
                            symbol={symbol}
                            reputation={reputation}
                            isNative={isNative}
                            isEth={isEth}
                          />
                        );
                      })}
                  </div>
                </DialogSection>
              </DialogBox>
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
            </Fragment>
          )}
        </ActionForm>
      </FullscreenDialog>
    );
  }
}

export default TaskEditDialog;
