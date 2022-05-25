import React, { useState, useRef, useEffect, ReactNode, useMemo } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';

import { Appearance } from '~core/Button';

import Button from '../Button';

interface Props {
  /** Text for the button copy. Supports interpolation with the following variable: `valueIsCopied: boolean` */
  text?: MessageDescriptor;
  /** Value to be copied to the clipboard */
  value: string;
  children?: ReactNode;
  appearance?: Appearance;
}

const MSG = defineMessages({
  copyLabel: {
    id: 'ClipboardCopy.copyLabel',
    defaultMessage: `{valueIsCopied, select,
      true {Copied}
      false {Copy}
    }`,
  },
});

const displayName = 'ClipboardCopy';

const ClipboardCopy = ({
  value,
  text,
  children,
  appearance = { size: 'small', theme: 'blue' },
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);
  const handleClipboardCopy = () => {
    setValueIsCopied(true);
    copyToClipboard(value);
    userFeedbackTimer.current = setTimeout(() => setValueIsCopied(false), 2000);
  };
  /*
   * We need to wrap the call in a second function, since only the returned
   * function gets called on unmount.
   * The first one is only called on render.
   */
  useEffect(() => () => clearTimeout(userFeedbackTimer.current), [
    userFeedbackTimer,
  ]);

  const buttonText = useMemo(
    () => (children === undefined && text === undefined ? MSG.copyLabel : text),
    [children, text],
  );

  return (
    <Button
      appearance={appearance}
      disabled={valueIsCopied}
      onClick={handleClipboardCopy}
      text={buttonText}
      textValues={{ valueIsCopied }}
    >
      {children}
    </Button>
  );
};

ClipboardCopy.displayName = displayName;

export default ClipboardCopy;
