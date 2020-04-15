import React, { ReactNode } from 'react';

import { DialogProps } from '../Dialog';
import Modal from '../Modal';
import Icon from '../Icon';
import styles from './ActivityBar.css';
import modalStyles from '../Modal/Modal.css';

interface Props extends DialogProps {
  /** Children that get rendered into ActivityBar content */
  children: ReactNode;

  /** Determines if the ActivityBar can be dismissed */
  isDismissable?: boolean;

  /** passed through to Modal, but will be prevented if isDimissable is falsy */
  shouldCloseOnEsc?: boolean;

  /** passed through to Modal, but will be prevented if isDimissable is falsy */
  shouldCloseOnOverlayClick?: boolean;
}

const ActivityBar = ({
  children,
  isDismissable = true,
  cancel,
  shouldCloseOnEsc,
  shouldCloseOnOverlayClick,
}: Props) => {
  const overlayClassName = {
    base: isDismissable ? modalStyles.overlayInvisible : modalStyles.overlay,
    afterOpen: modalStyles.overlayAfterOpen,
    beforeClose: modalStyles.overlayBeforeClose,
  };

  return (
    <Modal
      ariaHideApp={!isDismissable}
      role="dialog"
      onRequestClose={isDismissable ? cancel : () => false}
      shouldCloseOnEsc={isDismissable && shouldCloseOnEsc}
      shouldCloseOnOverlayClick={isDismissable && shouldCloseOnOverlayClick}
      overlayClassName={overlayClassName}
      isOpen
    >
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
        <div className={styles.control}>
          {isDismissable && (
            <Icon
              role="button"
              name="circle-close"
              title="close"
              onClick={cancel}
              appearance={{ size: 'medium', theme: 'invert' }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ActivityBar;
