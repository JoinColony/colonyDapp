import React, { ComponentProps, ComponentType, useCallback } from 'react';
import { MessageDescriptor } from 'react-intl';

import { useDialog } from '~core/Dialog';
import { ActionTransformFnType } from '~utils/actions';

import { Appearance } from './Button';
import ActionButton from './ActionButton';

interface Props<D extends ComponentType<any>> {
  appearance?: Appearance;
  className?: string;
  dialog: D;
  dialogProps?: Omit<ComponentProps<D>, 'close' | 'cancel'>;
  disabled?: boolean;
  submit: string;
  success: string;
  error: string;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any | ((dialogValues: any) => any | Promise<any>);
}

const DialogActionButton = <D extends ComponentType<any>>({
  submit,
  success,
  error,
  values: valuesProp = {},
  dialog,
  dialogProps,
  ...props
}: Props<D>) => {
  const openDialog = useDialog(dialog);
  const values = useCallback(async () => {
    const dialogValues = await openDialog(dialogProps).afterClosed();
    if (typeof valuesProp === 'function') return valuesProp(dialogValues);
    return { ...dialogValues, ...valuesProp };
  }, [dialogProps, openDialog, valuesProp]);
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

export default DialogActionButton;
