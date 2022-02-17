import React, { ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import classnames from 'classnames';

import Icon from '~core/Icon';

import styles from './Dialog.css';

import Modal from '../Modal';

const MSG = defineMessages({
  buttonCancel: {
    id: 'core.Dialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
});

interface Props {
  /** Dialog needs the cancel function from your Dialog component */
  cancel: () => void;
  /** Children to render in this Dialog */
  children: ReactNode;
  /** Determines if the Dialog can be dismissed */
  isDismissable?: boolean;
  /** Determines if the Dialog should allow elements to overflow */
  noOverflow?: boolean;
}

const displayName = 'Dialog';

const Dialog = ({
  children,
  cancel,
  isDismissable = true,
  noOverflow = true,
  ...props
}: Props) => (
  <Modal
    {...props}
    role="dialog"
    className={classnames(styles.modal, {
      [styles.overflowEnabled]: !noOverflow,
    })}
    onRequestClose={cancel}
    isOpen
  >
    {isDismissable && (
      <div className={styles.dialogOuterActions}>
        <button
          type="button"
          className={styles.closeIconButton}
          onClick={cancel}
        >
          <Icon
            appearance={{ size: 'medium' }}
            name="circle-close"
            title={MSG.buttonCancel}
          />
        </button>
      </div>
    )}
    <div
      className={classnames(styles.main, {
        [styles.overflowEnabled]: !noOverflow,
      })}
    >
      {children}
    </div>
  </Modal>
);

Dialog.displayName = displayName;

export default Dialog;
