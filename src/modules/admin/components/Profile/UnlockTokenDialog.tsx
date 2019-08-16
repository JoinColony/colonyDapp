import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';

const MSG = defineMessages({
  title: {
    id: 'admin.UnlockTokenDialog.title',
    defaultMessage: 'Are you sure you want to unlock this token?',
  },
  description: {
    id: 'admin.UnlockTokenDialog.description',
    defaultMessage: 'This cannot be undone. {learnMore}.',
  },
  learnMore: {
    id: 'admin.UnlockTokenDialog.learnMore',
    defaultMessage: 'Learn more',
  },
  unlockButton: {
    id: 'admin.UnlockTokenDialog.unlockButton',
    defaultMessage: 'Confirm',
  },
  cancelButton: {
    id: 'admin.UnlockTokenDialog.cancelButton',
    defaultMessage: 'Back',
  },
});

const displayName = 'admin.UnlockTokenDialog';

const LEARN_MORE_URL =
  // eslint-disable-next-line max-len
  'https://help.colony.io/hc/en-us/articles/360025429094-How-to-unlock-your-colony-s-native-token';

interface Props {
  cancel: () => void;
  close: () => void;
}

const UnlockTokenDialog = ({ cancel, close }: Props) => (
  <ConfirmDialog
    appearance={{ theme: 'danger' }}
    cancel={cancel}
    close={close}
    heading={MSG.title}
    confirmButtonText={MSG.unlockButton}
    cancelButtonText={MSG.cancelButton}
  >
    <FormattedMessage
      {...MSG.description}
      values={{
        learnMore: <ExternalLink href={LEARN_MORE_URL} text={MSG.learnMore} />,
      }}
    />
  </ConfirmDialog>
);

UnlockTokenDialog.displayName = displayName;

export default UnlockTokenDialog;
