import React, { useEffect } from 'react';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import styles from './Snackbar.css';

const displayName = 'Snackbar';

export const enum SnackbarType {
  Error = 1,
  Success,
}

interface Props {
  show: boolean;
  setShow: (value: State) => void;
  delay: number;
  msg: MessageDescriptor;
  type: Type;
}

const Snackbar = ({
  show,
  setShow,
  delay = 3000,
  msg,
  type = SnackbarType.Success,
}: Props) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => setShow(false), delay);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [delay, show, setShow]);

  return (
    <div className={show ? styles.fadeIn : styles.fadeOut}>
      <div
        className={
          type === SnackbarType.Success
            ? styles.containerSuccess
            : styles.containerError
        }
      >
        <div
          className={
            type === SnackbarType.Success ? styles.dotSuccess : styles.dotError
          }
        />
        <p className={styles.msgText}>
          <FormattedMessage {...msg} />
        </p>
      </div>
    </div>
  );
};

Snackbar.displayName = displayName;

export default Snackbar;
