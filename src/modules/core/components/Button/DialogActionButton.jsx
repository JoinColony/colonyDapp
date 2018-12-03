/* @flow */

import React from 'react';

import type { MessageDescriptor } from 'react-intl';

import withDialog from '~core/Dialog/withDialog';

import type { OpenDialog } from '~core/Dialog/types';

import ActionButton from './ActionButton.jsx';

type Props = {
  openDialog: OpenDialog,
  dialog: string,
  options: Object,
  submit: string,
  success: string,
  error: string,
  text: MessageDescriptor | string,
  setValues?: (dialogValues: Object) => Object | Promise<Object>,
};

const DialogActionButton = ({
  text,
  submit,
  success,
  error,
  setValues: setValuesProp,
  openDialog,
  dialog,
  options,
}: Props) => {
  const setValues = async () => {
    const values = await openDialog(dialog, options).afterClosed();
    return setValuesProp ? setValuesProp(values) : values;
  };
  return (
    <ActionButton
      text={text}
      submit={submit}
      success={success}
      error={error}
      setValues={setValues}
    />
  );
};

export default withDialog()(DialogActionButton);
