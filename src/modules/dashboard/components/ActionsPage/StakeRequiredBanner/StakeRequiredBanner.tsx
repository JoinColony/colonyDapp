import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert from '~core/Alert';
import ClipboardCopy from '~core/ClipboardCopy';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';

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
  copyURLTooltip: {
    id: `dashboard.ActionsPage.StakeRequiredBanner.copyURLTooltip`,
    defaultMessage: `URL copied to clipboard`,
  },
});

type Props = {
  stakeRequired: boolean;
};

const displayName = 'dashboard.ActionsPage.StakeRequiredBanner';

const StakeRequiredBanner = ({ stakeRequired }: Props) => {
  return stakeRequired ? (
    <div
      className={styles.stakeRequiredBannerContainer}
      data-test="stakeRequiredBanner"
    >
      <Alert
        appearance={{
          theme: 'pinky',
          margin: 'none',
          borderRadius: 'none',
        }}
      >
        <div className={styles.stakeRequiredBanner}>
          <FormattedMessage {...MSG.stakeRequired} />
          <Tooltip
            placement="right"
            trigger="click"
            content={<FormattedMessage {...MSG.copyURLTooltip} />}
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [15, 10],
                  },
                },
              ],
            }}
          >
            <span className={styles.share}>
              <ClipboardCopy
                value={window.location.href}
                appearance={{ theme: 'white' }}
              >
                <FormattedMessage {...MSG.shareUrl} />
                <Icon name="share" />
              </ClipboardCopy>
            </span>
          </Tooltip>
        </div>
      </Alert>
    </div>
  ) : null;
};

StakeRequiredBanner.displayName = displayName;

export default StakeRequiredBanner;
