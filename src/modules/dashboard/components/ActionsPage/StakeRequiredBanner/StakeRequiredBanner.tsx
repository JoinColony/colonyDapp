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
    defaultMessage: `{isDecision, select,
      true {Decision}
      false {Motion}
      } requires at least 10% stake to appear in the
      {isDecision, select,
        true {Decisions}
        false {actions}
        } list.`,
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
  isDecision?: boolean;
};

const displayName = 'dashboard.ActionsPage.StakeRequiredBanner';

const StakeRequiredBanner = ({ stakeRequired, isDecision = false }: Props) => {
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
          <FormattedMessage {...MSG.stakeRequired} values={{ isDecision }} />
          <span className={styles.share}>
            <Tooltip
              placement="left"
              trigger="click"
              content={<FormattedMessage {...MSG.copyURLTooltip} />}
            >
              <ClipboardCopy
                value={window.location.href}
                appearance={{ theme: 'white' }}
              >
                <FormattedMessage {...MSG.shareUrl} />
                <Icon name="share" />
              </ClipboardCopy>
            </Tooltip>
          </span>
        </div>
      </Alert>
    </div>
  ) : null;
};

StakeRequiredBanner.displayName = displayName;

export default StakeRequiredBanner;
