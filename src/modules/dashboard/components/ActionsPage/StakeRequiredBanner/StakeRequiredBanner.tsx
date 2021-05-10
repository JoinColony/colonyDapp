import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert from '~core/Alert';
import ClipboardCopy from '~core/ClipboardCopy';

import styles from './StakeRequiredBanner.css';

const MSG = defineMessages({
  stakeRequired: {
    id: `dashboard.ActionsPage.StakeRequiredBanner.stakeRequired`,
    defaultMessage: `Motion requires at least 10% stake to appear in the actions list.`,
  },
  shareUrl: {
    id: `dashboard.ActionsPage.StakeRequiredBanner.shareUrl`,
    defaultMessage: `Share URL`,
  },
});

type Props = {
  stakeRequired: boolean;
};

const displayName = 'dashboard.ActionsPage.StakeRequiredBanner';

const StakeRequiredBanner = ({
  stakeRequired
}: Props) => {
  return stakeRequired ? (
    <div className={styles.stakeRequiredBannerContainer}>
      <Alert
        appearance={{
          theme: 'pinky',
          margin: 'none',
          borderRadius: 'none',
        }}
      >
        <div className={styles.stakeRequiredBanner}>
          <FormattedMessage {...MSG.stakeRequired} />
          <span className={styles.share}>
            <ClipboardCopy value={window.location.href} text={MSG.shareUrl}/>
          </span>
        </div>
      </Alert>
    </div>
  ) : null;
};

StakeRequiredBanner.displayName = displayName;

export default StakeRequiredBanner;
