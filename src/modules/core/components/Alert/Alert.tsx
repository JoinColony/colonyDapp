import React, { ReactNode, useCallback, useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './Alert.css';

interface Appearance {
  borderRadius?: 'small' | 'medium' | 'large' | 'round' | 'none';
  theme?: 'primary' | 'info' | 'danger' | 'pinky';
  size?: 'small';
  margin?: 'none' | 'default';
}

type childrenFn = (handleDismissed: any) => void;

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** `children` to render (only works if `text` is not set) */
  children?: ReactNode | childrenFn;

  /** A string or a `messageDescriptor` that make up the alert's content */
  text?: MessageDescriptor | string;

  /** Values for loading text (react-intl interpolation) */
  textValues?: SimpleMessageValues;

  /** Callback after alert is dismissed (only if `isDismissible` is `true`) */
  onAlertDismissed?: () => void;
}

const displayName = 'Alert';

const Alert = ({
  appearance = { theme: 'danger', margin: 'default' },
  onAlertDismissed: callback,
  children,
  text,
  textValues,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { formatMessage } = useIntl();

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    if (typeof callback === 'function') {
      callback();
    }
  }, [callback]);

  if (!isOpen) return null;

  const alertText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);
  return (
    <div className={getMainClasses(appearance, styles)}>
      <>
        {alertText || typeof children === 'function'
          ? (children as childrenFn)(handleDismiss)
          : children}
      </>
    </div>
  );
};

Alert.displayName = displayName;

export default Alert;
