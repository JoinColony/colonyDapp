import { ComponentType, ReactNode, useCallback } from 'react';

import useDialog from './useDialog';

interface Props {
  /** Render prop for element opening the dialog. In 99,9% this will be a button! */
  children: ({ open: OpenDialog }) => ReactNode;
  /** Props passed to the dialog */
  props?: { [k: string]: any };
  /** Component of the Dialog to open */
  to: ComponentType<any>;
}

const DialogLink = ({ children, props, to }) => {
  const openDialog = useDialog(to);
  const open = useCallback(() => {
    return openDialog(props);
  }, [openDialog, props]);

  return children({ open });
};

export default DialogLink;
