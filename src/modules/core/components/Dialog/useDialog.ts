import { ComponentProps, ComponentType, useContext } from 'react';

import { DialogContext } from './DialogProvider';

const useDialog = <N extends ComponentType<any>>(component: N) => {
  const { openDialog } = useContext(DialogContext);
  return (props?: Omit<ComponentProps<N>, 'close' | 'cancel'>) => {
    if (!openDialog) {
      throw new Error('Could not find DialogContext');
    }
    return openDialog(component, props);
  };
};

export default useDialog;
