import React, { useState, useCallback } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';

import Button from '../Button';

interface Props {
  text?: MessageDescriptor;
  value: string;
};

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
  text = MSG.copyLabel,
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const handleClipboardCopy = useCallback(() => {
    setValueIsCopied(true);
    copyToClipboard(value);
    const timer = setTimeout(() => setValueIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [value, copyToClipboard, setValueIsCopied]);
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
