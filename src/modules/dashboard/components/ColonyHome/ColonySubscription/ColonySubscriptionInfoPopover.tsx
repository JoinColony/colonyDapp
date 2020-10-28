import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import ENS from '~lib/ENS';
import Popover from '~core/Popover';
import ColonyAvatar from '~core/ColonyAvatar';
import MaskedAddress from '~core/MaskedAddress';

import styles from './ColonySubscriptionInfoPopover.css';

const MSG = defineMessages({
  leaveColonyQuestion: {
    id:
      'dashboard.ColonyHome.ColonySubscriptionInfoPopover.leaveColonyQuestion',
    defaultMessage: 'Leave?',
  },
  nativeTokenTitle: {
    id: 'dashboard.ColonyHome.ColonySubscriptionInfoPopover.nativeTokenTitle',
    defaultMessage: 'NativeTokenAddress',
  },
});

interface Props {
  colonyAddress: Address;
  colonyDisplayName: string;
  colonyName: string;
  nativeTokenAddress: Address;
  onUnsubscribe?: () => void;
  children?: ReactNode;
}

const ColonySubscriptionInfoPopover = ({
  children,
  colonyAddress,
  colonyDisplayName,
  colonyName,
  nativeTokenAddress,
  onUnsubscribe = () => {},
}: Props) => (
  <Popover
    content={
      <div className={styles.main}>
        <div className={styles.colonyDetails}>
          <div className={styles.colonyAvatar}>
            <ColonyAvatar colonyAddress={colonyAddress} size="s" />
          </div>
          <div className={styles.colonyInfo}>
            <span className={styles.colonyInfoTitle}>{colonyDisplayName}</span>
            <span className={styles.colonyInfoENS}>
              {ENS.getFullDomain('colony', colonyName)}
            </span>
            <span className={styles.colonyInfoAddress}>
              <MaskedAddress address={colonyAddress} full />
            </span>
          </div>
          <button
            type="button"
            className={styles.unsubscribeFromColony}
            onClick={onUnsubscribe}
          >
            <FormattedMessage {...MSG.leaveColonyQuestion} />
          </button>
        </div>
        <span className={styles.nativeTokenTitle}>
          <FormattedMessage {...MSG.nativeTokenTitle} />
        </span>
        <span className={styles.nativeTokenAddress}>
          <MaskedAddress address={nativeTokenAddress} full />
        </span>
      </div>
    }
    trigger="click"
    showArrow={false}
    placement="right"
    popperProps={{
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
            offset: [100, -10],
          },
        },
      ],
    }}
  >
    {children}
  </Popover>
);

ColonySubscriptionInfoPopover.displayName =
  'dashboard.ColonyHome.ColonySubscriptionInfoPopover';

export default ColonySubscriptionInfoPopover;
