import React, { ReactNode, useCallback, useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import Icon from '~core/Icon';
import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './Alert.css';

interface Appearance {
  borderRadius?: 'small' | 'medium' | 'large' | 'round';
  theme?: 'primary' | 'info' | 'danger';
  size?: 'small';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** `children` to render (only works if `text` is not set) */
  children?: ReactNode;

  /** A string or a `messageDescriptor` that make up the alert's content */
  text?: MessageDescriptor | string;

  /** Values for loading text (react-intl interpolation) */
  textValues?: SimpleMessageValues;

  /** Should the alert be dismissible */
  isDismissible?: boolean;

  /** Callback after alert is dismissed (only if `isDismissible` is `true`) */
  onAlertDismissed?: () => void;
}

const displayName = 'Alert';

const Alert = ({
  appearance = { theme: 'danger' },
  onAlertDismissed: callback,
  isDismissible = false,
  children,
  text,
  textValues,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { formatMessage } = useIntl();

  const handleDismiss = useCallback(() => {
    if (!isDismissible) {
      return;
    }
    setIsOpen(false);
    if (typeof callback === 'function') {
      callback();
    }
  }, [callback, isDismissible]);

  if (!isOpen) return null;

  const alertText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);
  return (
    <div className={getMainClasses(appearance, styles)}>
      {isDismissible && (
        <button
          className={styles.closeButton}
          type="button"
          onClick={handleDismiss}
        >
          <Icon
            appearance={{ size: 'small' }}
            name="close"
            title={{ id: 'button.close' }}
          />
        </button>
      )}
      {alertText || children}
    </div>
  );
};

Alert.displayName = displayName;

export default Alert;
