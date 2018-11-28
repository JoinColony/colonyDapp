/* @flow */

import React from 'react';

import type { MessageDescriptor } from 'react-intl';

import withDialog from '~core/Dialog/withDialog';
import { ActionForm } from '~core/Fields';
import Button from '~core/Button';

import type { OpenDialog } from '~core/Dialog/types';
import type { Action } from '~types/';

type Props = {
  openDialog: OpenDialog,
  dialog: string,
  options: Object,
  submit: string,
  success: string,
  error: string,
  text: MessageDescriptor | string,
  setPayload?: (action: Action, values: Object) => Action,
};

const DialogActionButton = ({
  openDialog,
  dialog,
  options,
  submit,
  success,
  error,
  text,
  setPayload,
}: Props) => (
  <ActionForm
    submit={submit}
    success={success}
    error={error}
    setPayload={setPayload}
  >
    {({ isSubmitting, setValues, submitForm }) => (
      <Button
        text={text}
        onClick={() =>
          openDialog(dialog, options)
            .afterClosed()
            .then(values => {
              setValues(values);
              submitForm();
            })
        }
        loading={isSubmitting}
      />
    )}
  </ActionForm>
);

export default withDialog()(DialogActionButton);
