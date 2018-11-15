/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';

const MSG = defineMessages({
  title: {
    id: 'user.UnfinishedProfileDialog.title',
    defaultMessage: 'Unfinished Profile',
  },
});

type Props = {
  cancel: () => void,
  close: () => void,
};

const displayName = 'user.UnfinishedProfileDialog';

const ManagerRatingDialog = ({ cancel }: Props) => (
  <Dialog cancel={cancel}>
    <DialogSection>
      <FormattedMessage {...MSG.title} />
    </DialogSection>
  </Dialog>
);

ManagerRatingDialog.displayName = displayName;

export default ManagerRatingDialog;
