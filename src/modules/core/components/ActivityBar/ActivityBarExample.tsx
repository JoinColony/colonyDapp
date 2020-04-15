import React, { useState } from 'react';

import ActivityBar from './ActivityBar';
import styles from './ActivityBar.css';

import Button from '../Button';

interface Props {
  cancel: () => void;
  close: (val: any) => void;
}

const ActivityBarExample = ({ cancel, close }: Props) => {
  const [isDismissible, setIsDismissible] = useState<boolean>(true);

  return (
    <ActivityBar
      isDismissable={isDismissible}
      close={close}
      cancel={cancel}
      shouldCloseOnEsc
    >
      {isDismissible ? (
        <div className={styles.component}>
          <div>you can just dismiss me or ... </div>
          <Button onClick={() => setIsDismissible(false)}>
            make me require your attention
          </Button>
        </div>
      ) : (
        <div className={styles.component}>
          <div>HELLO I need your attention!!! You can now only... </div>
          <Button onClick={cancel}>dismiss</Button>
          <Button onClick={close}>or confirm</Button>
        </div>
      )}
    </ActivityBar>
  );
};

export default ActivityBarExample;
