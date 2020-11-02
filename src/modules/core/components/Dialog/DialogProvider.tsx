import React, {
  createContext,
  ComponentType,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { nanoid } from 'nanoid';

import { DialogType } from './types';

export const DialogContext = createContext<{
  openDialog?: <P extends object>(
    dialog: ComponentType<P>,
    props?: P,
  ) => DialogType<P>;
}>({});

interface Props {
  children: ReactNode;
}

const DialogProvider = ({ children }: Props) => {
  const [openDialogs, setOpenDialogs] = useState<DialogType<any>[]>([]);

  const closeDialog = useCallback((key: string) => {
    setOpenDialogs((prevOpenDialogs) => {
      const idx = prevOpenDialogs.findIndex((dialog) => dialog.key === key);
      if (idx < 0) {
        return prevOpenDialogs;
      }
      return [
        ...prevOpenDialogs.slice(0, idx),
        ...prevOpenDialogs.slice(idx + 1, prevOpenDialogs.length),
      ];
    });
  }, []);

  const pushDialog = useCallback(
    <P extends object>(Dialog: ComponentType<P>, props?: P): DialogType<P> => {
      let resolvePromise;
      let rejectPromise;
      const key = nanoid();
      const close = (val: any) => {
        closeDialog(key);
        if (resolvePromise) resolvePromise(val);
      };
      const cancel = () => {
        closeDialog(key);
        if (rejectPromise) rejectPromise(new Error('User cancelled'));
      };
      const dialog = {
        Dialog,
        cancel,
        close,
        key,
        props,
        afterClosed: () =>
          new Promise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          }),
      };
      setOpenDialogs((prevOpenDialogs) => [...prevOpenDialogs, dialog]);
      return dialog;
    },
    [closeDialog],
  );

  return (
    <>
      <DialogContext.Provider value={{ openDialog: pushDialog }}>
        {children}
      </DialogContext.Provider>
      {openDialogs.map(({ Dialog, props, ...dialogProps }) => (
        <Dialog {...dialogProps} {...props} />
      ))}
    </>
  );
};

export default DialogProvider;
