import React, { ReactNode, useState, useEffect } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import { Placement } from '@popperjs/core';

import copyToClipboard from 'copy-to-clipboard';
import { Address } from '~types/index';
import { Tooltip } from '~core/Popover';

import styles from './InvisibleCopyableAddress.css';

interface Props {
  /** Children element as we don't want style address here */
  children: ReactNode;
  /** Address to display and copy */
  address: Address;
  /** Text which will display in tooltip when hovering on address */
  copyMessage?: MessageDescriptor;
  /** Determines the position of the tooltip's text */
  tooltipPlacement?: Placement;
}

const MSG = defineMessages({
  copyAddressTooltip: {
    id: 'InvisibleCopyableAddress.copyAddressTooltip',
    defaultMessage: `{copied, select,
      true {Copied}
      false {{tooltipMessage}}
    }`,
  },
  copyMessage: {
    id: 'InvisibleCopyableAddress.copyMessage',
    defaultMessage: 'Click to copy address',
  },
});

const displayName = 'InvisibleCopyableAddress';

const InvisibleCopyableAddress = ({
  children,
  address,
  copyMessage,
  tooltipPlacement = 'right',
}: Props) => {
  const [copied, setCopied] = useState(false);
  const { formatMessage } = useIntl();

  const handleClipboardCopy = () => {
    setCopied(true);
    copyToClipboard(address);
  };

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);
  const tooltipMessage =
    (copyMessage && formatMessage(copyMessage)) ||
    formatMessage(MSG.copyMessage);
  return (
    <Tooltip
      placement={tooltipPlacement}
      trigger="hover"
      content={
        <FormattedMessage
          {...MSG.copyAddressTooltip}
          values={{ copied, tooltipMessage }}
        />
      }
    >
      <div className={styles.addressWrapper}>
        <div
          onClick={handleClipboardCopy}
          onKeyPress={handleClipboardCopy}
          role="button"
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    </Tooltip>
  );
};

InvisibleCopyableAddress.displayName = displayName;

export default InvisibleCopyableAddress;
