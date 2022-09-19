import React, { ReactNode, useMemo } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { Appearance } from '~core/Button';
import { useClipboardCopy } from '~modules/dashboard/hooks';

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
  const { isCopied: valueIsCopied, handleClipboardCopy } = useClipboardCopy(
    value,
  );

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
