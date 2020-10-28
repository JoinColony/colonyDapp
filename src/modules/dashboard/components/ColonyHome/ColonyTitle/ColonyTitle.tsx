import React, { useState, useRef, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';

import { Colony } from '~data/index';
import Heading from '~core/Heading';
import MaskedAddress from '~core/MaskedAddress';
import { Tooltip } from '~core/Popover';
import ColonySubscription from '../ColonySubscription';

import styles from './ColonyTitle.css';

const MSG = defineMessages({
  fallbackColonyName: {
    id: 'dashboard.ColonyHome.ColonyTitle.fallbackColonyName',
    defaultMessage: 'Unknown Colony',
  },
  copyAddressTooltip: {
    id: 'dashboard.ColonyHome.ColonyTitle.copyAddressTooltip',
    defaultMessage: `{valueIsCopied, select,
      true {Copied}
      false {Click to copy colony address}
    }`,
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyTitle';

const ColonyTitle = ({
  colony: { displayName: colonyDisplayName, colonyName, colonyAddress },
}: Props) => {
  const [valueIsCopied, setValueIsCopied] = useState(false);
  const userFeedbackTimer = useRef<any>(null);
  const handleClipboardCopy = () => {
    setValueIsCopied(true);
    copyToClipboard(colonyAddress);
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
    <div className={styles.main}>
      <div className={styles.colonyTitle}>
        <Heading
          appearance={{
            size: 'medium',
            weight: 'thin',
            margin: 'none',
          }}
          text={colonyDisplayName || colonyName || MSG.fallbackColonyName}
        />
      </div>
      <div>
        <Tooltip
          placement="right"
          trigger="hover"
          content={
            <div className={styles.copyAddressTooltip}>
              <FormattedMessage
                {...MSG.copyAddressTooltip}
                values={{ valueIsCopied }}
              />
            </div>
          }
        >
          <div className={styles.colonyAddressWrapper}>
            <div
              className={styles.colonyAddress}
              onClick={handleClipboardCopy}
              onKeyPress={handleClipboardCopy}
              role="button"
              tabIndex={0}
            >
              <MaskedAddress address={colonyAddress} />
            </div>
          </div>
        </Tooltip>
        <ColonySubscription colonyAddress={colonyAddress} />
      </div>
    </div>
  );
};

ColonyTitle.displayName = displayName;

export default ColonyTitle;
