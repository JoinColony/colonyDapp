import React, { ReactNode } from 'react';

import Icon from '~core/Icon';
import styles from './FullscreenDialog.css';
import Modal from '../Modal';

interface Props {
  /** Dialog needs the cancel function from your Dialog component */
  cancel: () => void;

  /** Children to render in this Dialog */
  children: ReactNode;

  /** Determines if the Dialog can be dismissed */
  isDismissable?: boolean;
}

const FullscreenDialog = ({
  children,
  cancel,
  isDismissable = true,
  ...props
}: Props) => (
  <Modal
    {...props}
    className={styles.modal}
    role="dialog"
    overlayClassName={styles.overlay}
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
          <Icon name="circle-close" title={{ id: 'button.cancel' }} />
        </button>
      </div>
    )}
    <div className={styles.main}>{children}</div>
  </Modal>
);
export default FullscreenDialog;
