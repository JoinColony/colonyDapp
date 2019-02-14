/* @flow */

import React from 'react';

import withDialog from '~components/core/Dialog/withDialog';

import type { OpenDialog } from '~components/core/Dialog/types';

import ActionButton from './ActionButton.jsx';

// Can't seal this object because of `withConsumerFactory`
type Props = {
  openDialog: OpenDialog,
  dialog: string,
  dialogProps: Object,
  submit: string,
  success: string,
  error: string,
  values?: Object | ((dialogValues: Object) => Object | Promise<Object>),
};

const DialogActionButton = ({
  submit,
  success,
  error,
  values: valuesProp = {},
  openDialog,
  dialog,
  dialogProps,
  ...props
}: Props) => {
  const values = async () => {
    const dialogValues = await openDialog(dialog, dialogProps).afterClosed();
    if (typeof valuesProp === 'function') return valuesProp(dialogValues);
    return { ...dialogValues, ...valuesProp };
  };
  return (
    <ActionButton
      submit={submit}
      success={success}
      error={error}
      values={values}
      {...props}
    />
  );
};

export default withDialog()(DialogActionButton);
