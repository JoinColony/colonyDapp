import React, { useCallback } from 'react';
import { Location } from 'history';
import { useFormikContext } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Prompt, useHistory } from 'react-router-dom';

import { useDialog, ConfirmDialog } from '~core/Dialog';

const MSG = defineMessages({
  dialogButtonConfirm: {
    id: 'Fields.Form.UnsavedGuard.dialogButtonConfirm',
    defaultMessage: 'Yes, discard my changes',
  },
  dialogTitle: {
    id: 'Fields.Form.UnsavedGuard.dialogTitle',
    defaultMessage: 'Unsaved Changes',
  },
  dialogText: {
    id: 'Fields.Form.UnsavedGuard.dialogText',
    defaultMessage: `You have unsaved changes. Leaving this page will
      discard your changes.
      {br}{br}
      Are you sure you want to proceed?`,
  },
});

const displayName = 'Fields.Form.UnsavedGuard';

const UnsavedGuard = () => {
  const { dirty } = useFormikContext();
  const openDialog = useDialog(ConfirmDialog);
  const history = useHistory();

  const handleCustomDialog = useCallback(
    async (location: Location) => {
      await openDialog({
        heading: MSG.dialogTitle,
        children: (
          <FormattedMessage {...MSG.dialogText} values={{ br: <br /> }} />
        ),
        confirmButtonText: MSG.dialogButtonConfirm,
      }).afterClosed();
      history.push(location.pathname, { discardChanges: true });
    },
    [history, openDialog],
  );

  const getMessage = useCallback(
    (location: Location) => {
      const discardChanges = location.state && location.state.discardChanges;
      if (dirty && !discardChanges) {
        handleCustomDialog(location);
        return false;
      }
      return true;
    },
    [dirty, handleCustomDialog],
  );
  return <Prompt when={dirty} message={getMessage} />;
};

UnsavedGuard.displayName = displayName;

export default UnsavedGuard;
