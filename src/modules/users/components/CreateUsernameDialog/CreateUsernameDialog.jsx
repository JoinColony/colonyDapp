/* @flow */

import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, FieldSet, Input } from '~core/Fields';

import {
  USERNAME_CREATE,
  USERNAME_CREATE_SUCCESS,
  USERNAME_CREATE_ERROR,
} from '../../actionTypes';

const MSG = defineMessages({
  usernameLabel: {
    id: 'users.CreateUsernameDialog.usernameLabel',
    defaultMessage: 'Your desired username',
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
    .username(),
});

class CreateUsernameDialog extends Component<Props> {
  doStuff = () => {};

  render() {
    const { cancel, close } = this.props;
    return (
      <Dialog cancel={cancel}>
        <ActionForm
          submit={USERNAME_CREATE}
          success={USERNAME_CREATE_SUCCESS}
          error={USERNAME_CREATE_ERROR}
          validationSchema={validationSchema}
          onSuccess={close}
        >
          {({ isSubmitting }) => (
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
