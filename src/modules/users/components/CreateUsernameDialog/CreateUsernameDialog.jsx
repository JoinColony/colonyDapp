/* @flow */

import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, FieldSet, Input } from '~core/Fields';

import promiseListener from '../../../../createPromiseListener';

import {
  USERNAME_CREATE,
  USERNAME_CREATE_SUCCESS,
  USERNAME_CREATE_ERROR,
  USERNAME_CHECK_AVAILABILITY,
  USERNAME_CHECK_AVAILABILITY_SUCCESS,
  USERNAME_CHECK_AVAILABILITY_ERROR,
} from '../../actionTypes';

const MSG = defineMessages({
  usernameLabel: {
    id: 'users.CreateUsernameDialog.usernameLabel',
    defaultMessage: 'Your desired username',
  },
  errorUsernameTaken: {
    id: 'users.CreateUsernameDialog.errorUsernameTaken',
    defaultMessage: 'This username is already taken',
  },
});

type FormValues = {
  username: string,
};

type Props = {
  cancel: () => void,
  close: () => void,
} & FormikProps<FormValues>;

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .ensAddress(),
});

class CreateUsernameDialog extends Component<Props> {
  componentWillUnmount() {
    this.checkUsernameTaken.unsubscribe();
  }

  checkUsernameTaken = promiseListener.createAsyncFunction({
    start: USERNAME_CHECK_AVAILABILITY,
    resolve: USERNAME_CHECK_AVAILABILITY_SUCCESS,
    reject: USERNAME_CHECK_AVAILABILITY_ERROR,
  });

  validateUsername = async (values: FormValues) => {
    try {
      await this.checkUsernameTaken.asyncFunction(values);
    } catch (e) {
      const error = {
        username: MSG.errorUsernameTaken,
      };
      // eslint doesn't allow for throwing object literals
      throw error;
    }
  };

  render() {
    const { cancel, close } = this.props;
    return (
      <Dialog cancel={cancel}>
        <ActionForm
          submit={USERNAME_CREATE}
          success={USERNAME_CREATE_SUCCESS}
          error={USERNAME_CREATE_ERROR}
          validationSchema={validationSchema}
          validate={this.validateUsername}
          onSuccess={close}
        >
          {({ isSubmitting, isValid }) => (
            <Fragment>
              <DialogSection>
                <FieldSet>
                  <Input name="username" label={MSG.usernameLabel} />
                </FieldSet>
              </DialogSection>
              <DialogSection appearance={{ align: 'right' }}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  text={{ id: 'button.cancel' }}
                  onClick={cancel}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  text={{ id: 'button.confirm' }}
                  loading={isSubmitting}
                  disabled={!isValid}
                />
              </DialogSection>
            </Fragment>
          )}
        </ActionForm>
      </Dialog>
    );
  }
}

export default CreateUsernameDialog;
