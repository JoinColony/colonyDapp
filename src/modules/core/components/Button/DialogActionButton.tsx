import React, { useCallback } from 'react';

import withDialog from '~core/Dialog/withDialog';
import { OpenDialog } from '~core/Dialog/types';
import ActionButton from './ActionButton';

interface Props {
  openDialog: OpenDialog;
  dialog: string;
  dialogProps: any;
  submit: string;
  success: string;
  error: string;
  values?: any | ((dialogValues: any) => any | Promise<any>);
}

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
  const values = useCallback(async () => {
    const dialogValues = await openDialog(dialog, dialogProps).afterClosed();
    if (typeof valuesProp === 'function') return valuesProp(dialogValues);
    return { ...dialogValues, ...valuesProp };
  }, [dialog, dialogProps, openDialog, valuesProp]);
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

export default withDialog()(DialogActionButton) as any;
