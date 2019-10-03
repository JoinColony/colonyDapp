import React, { useState, useRef, useEffect } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';

import Button from '../Button';

interface Props {
  text?: MessageDescriptor;
  value: string;
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

const ClipboardCopy = ({ value, text = MSG.copyLabel }: Props) => {
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
  return (
    <Button
      appearance={{ size: 'small', theme: 'blue' }}
      disabled={valueIsCopied}
      onClick={handleClipboardCopy}
      text={text}
      textValues={{ valueIsCopied }}
    />
  );
};

ClipboardCopy.displayName = displayName;

export default ClipboardCopy;
