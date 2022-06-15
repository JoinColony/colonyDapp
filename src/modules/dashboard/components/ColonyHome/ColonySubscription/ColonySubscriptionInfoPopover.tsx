import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import Popover from '~core/Popover';
import Button from '~core/Button';
import MaskedAddress from '~core/MaskedAddress';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import ENS from '~lib/ENS';
import { Colony } from '~data/index';

import styles from './ColonySubscriptionInfoPopover.css';
import { mobile } from '~utils/mediaQueries';

const MSG = defineMessages({
  leaveColonyQuestion: {
    id:
      'dashboard.ColonyHome.ColonySubscriptionInfoPopover.leaveColonyQuestion',
    defaultMessage: 'Leave?',
  },
  nativeTokenTitle: {
    id: 'dashboard.ColonyHome.ColonySubscriptionInfoPopover.nativeTokenTitle',
    defaultMessage: 'Native Token Address',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: true });

interface Props {
  colony: Colony;
  onUnsubscribe?: () => void;
  children?: ReactNode;
  canUnsubscribe?: boolean;
}

const ColonySubscriptionInfoPopover = ({
  children,
  colony: { colonyAddress, displayName, colonyName, nativeTokenAddress },
  colony,
  canUnsubscribe = true,
  onUnsubscribe = () => {},
}: Props) => {
  const isMobile = useMediaQuery({ query: mobile });
  const offset = isMobile ? [115, -365] : [100, -10];

  return (
    <Popover
      content={
        <div className={styles.main}>
          <div className={styles.colonyDetails}>
            <div className={styles.colonyAvatar}>
              <ColonyAvatar
                colonyAddress={colonyAddress}
                colony={colony}
                size="s"
              />
            </div>
            <div className={styles.colonyInfo}>
              <span className={styles.colonyInfoTitle}>{displayName}</span>
              <span className={styles.colonyInfoENS}>
                {ENS.getFullDomain('colony', colonyName)}
              </span>
              <span className={styles.colonyInfoAddress}>
                <MaskedAddress address={colonyAddress} full />
              </span>
            </div>
            {canUnsubscribe && (
              <div className={styles.unsubscribeFromColony}>
                <Button
                  appearance={{ theme: 'blue', size: 'small' }}
                  onClick={onUnsubscribe}
                >
                  <FormattedMessage {...MSG.leaveColonyQuestion} />
                </Button>
              </div>
            )}
          </div>
          <span className={styles.nativeTokenTitle}>
            <FormattedMessage {...MSG.nativeTokenTitle} />
          </span>
          <span className={styles.nativeTokenAddress}>
            <MaskedAddress
              address={nativeTokenAddress}
              full
              dataTest="nativeTokenAddress"
            />
          </span>
        </div>
      }
      trigger="click"
      showArrow={false}
      placement="right"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              /*
               * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
               *
               * There's no logic to how they are calculated, so next time you need
               * to change them you'll either have to go by exact specs, or change
               * them until it "feels right" :)
               */
              offset,
            },
          },
        ],
      }}
    >
      {children}
    </Popover>
  );
};

ColonySubscriptionInfoPopover.displayName =
  'dashboard.ColonyHome.ColonySubscriptionInfoPopover';

export default ColonySubscriptionInfoPopover;
