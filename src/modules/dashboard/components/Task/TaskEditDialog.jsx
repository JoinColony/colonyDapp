/* @flow */
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import nanoid from 'nanoid';
import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FieldArray } from 'formik';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
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
  notSet: {
    id: 'dashboard.task.taskEditDialog.notSet',
    defaultMessage: 'Not set',
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
type State = {
  touched: boolean,
};
type Props = {
  /* This will soon get the current payout array if there's one set already
  passed in as props */
  cancel: () => void,
};
const validateFunding = (): any =>
  yup.object().shape({
    payouts: yup
      .array()
      .of(
        yup.object().shape({
          symbol: yup.number().required(),
          amount: yup.number().required(),
        }),
      )
      .max(2),
    // For the MVP we decided to pick from ETH and CLNY
  });
const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );
class TaskEditDialog extends Component<Props, State> {
  static displayName = 'dashboard.task.taskEditDialog';

  state = {
    touched: false,
  };

  addTokenFunding = (helpers: () => void) => {
    helpers.push({
      symbol: '',
      amount: undefined,
      isNative: false,
      isEth: false,
    });
    this.setState({
      touched: true,
    });
  };

  render() {
    const { cancel } = this.props;
    const { touched } = this.state;
    const { reputation } = taskMock;
    const { payouts } = taskMock;
    const assignee = null;
    return (
      <FullscreenDialog cancel={cancel}>
        <ActionForm
           submit="CREATE_COOL_THING"
           success="COOL_THING_CREATED"
           error="COOL_THING_CREATE_ERROR"
           initialValues={{ payouts, assignee }}
           validationSchema={validateFunding()}
         >
           {({ status, values }) => (
            <Fragment>
              <FormStatus status={status} />
              <DialogBox>
                <DialogSection appearance={{ border: 'bottom' }}>
                  <Heading
                    appearance={{ size: 'medium' }}
                    text={MSG.titleAssignment}
                  />
                  <SingleUserPicker
                    name="assignee"
                    isResettable
                    itemComponent={ItemDefault}
                    label={MSG.selectAssignee}
                    data={userMocks}
                    filter={filter}
                    placeholder={MSG.search}
                  />
                </DialogSection>
                <DialogSection>
                  <FieldArray
                    name="payouts"
                    render={arrayHelpers => (
                      <div className={styles.taskEditContainer}>
                        <div className={styles.editor}>
                          <Heading
                            appearance={{ size: 'medium' }}
                            text={MSG.titleFunding}
                          />
                          <Button
                            appearance={{ theme: 'blue', size: 'small' }}
                            text={MSG.add}
                            onClick={() => this.addTokenFunding(arrayHelpers)}
                          />
                        </div>
                        {values.payouts &&
                          values.payouts.map((payout, index) => {
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
                    )}
                  />
                </DialogSection>
              </DialogBox>
              <div className={styles.buttonContainer}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={{ id: 'button.cancel' }}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  text={{ id: 'button.confirm' }}
                  type="submit"
                  disabled={touched}
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
