import React, { ReactNode, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import copyToClipboard from 'copy-to-clipboard';
import { Address } from '~types/index';
import { Tooltip } from '~core/Popover';

import styles from './InvisibleCopyableAddress.css';

interface Props {
  /** Children element as we don't want style address here */
  children: ReactNode;
  /** Address to display and copy */
  address: Address;
}

const MSG = defineMessages({
  copyAddressTooltip: {
    id: 'InvisibleCopyableAddress.copyAddressTooltip',
    defaultMessage: `{copied, select,
      true {Copied}
      false {Click to copy colony address}
    }`,
  },
});

const displayName = 'InvisibleCopyableAddress';

const InvisibleCopyableAddress = ({ children, address }: Props) => {
  const [copied, setCopied] = useState(false);
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

  return (
    <Tooltip
      placement="right"
      trigger="hover"
      content={
        <div className={styles.copyAddressTooltip}>
          <FormattedMessage {...MSG.copyAddressTooltip} values={{ copied }} />
        </div>
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
