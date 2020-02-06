import React, { FC } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Dialog, { DialogSection } from '~core/Dialog';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.TaskFinalizeDialog.heading',
    defaultMessage: 'Insufficient Domain Funds',
  },
  description: {
    id: 'dashboard.TaskFinalizeDialog.description',
    defaultMessage: `The current domain does not have enough funds in it's pot,
      in order to cover this task's payout`,
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
}

const TaskFinalizeDialog = ({ cancel, close }: Props) => (
  <Dialog cancel={cancel}>
    <DialogSection appearance={{ border: 'bottom' }}>
      <Heading
        appearance={{ size: 'medium', margin: 'none' }}
        text={MSG.heading}
      />
    </DialogSection>
    <DialogSection appearance={{ border: 'bottom' }}>
      <FormattedMessage {...MSG.description} />
    </DialogSection>
    <DialogSection appearance={{ align: 'right' }}>
      <Button
        appearance={{
          theme: 'primary',
          size: 'large',
        }}
        autoFocus
        onClick={() => close()}
        text={{ id: 'button.ok' }}
      />
    </DialogSection>
  </Dialog>
);

export default TaskFinalizeDialog as FC<Props>;
