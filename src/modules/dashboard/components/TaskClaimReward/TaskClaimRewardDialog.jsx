/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';

import styles from './TaskClaimRewardDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskClaimRewardDialog.title',
    defaultMessage: 'Claim Reward',
  },
});

type Props = {
  cancel: () => void,
  close: () => void,
};

const displayName = 'dashboard.TaskClaimRewardDialog';

const TaskClaimRewardDialog = ({ cancel, close }: Props) => (
  <Dialog cancel={cancel} className={styles.main}>
    <DialogSection appearance={{ border: 'bottom' }}>
      <Heading appearance={{ size: 'medium' }} text={MSG.title} />
    </DialogSection>
    <DialogSection appearance={{ align: 'right' }}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={cancel}
        text={{ id: 'button.cancel' }}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={{ id: 'button.continue' }}
        onClick={() => {
          /* eslint-disable-next-line no-console */
          console.log(`[${displayName}]`, 'Claimed that sweet, sweet reward!');
          return close();
        }}
      />
    </DialogSection>
  </Dialog>
);

TaskClaimRewardDialog.displayName = displayName;

export default TaskClaimRewardDialog;
