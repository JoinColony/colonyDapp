import React, { useState } from 'react';

import { AddressZero } from 'ethers/constants';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Checkbox } from '~core/Fields';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { createAddress } from '~utils/web3';
import { Colony, useUser } from '~data/index';
import { Address } from '~types/index';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';
import tooltipStyles from './tooltip.css';

import styles from './UserCheckbox.css';

interface Props {
  colony: Colony;
  walletAddress: Address;
  name: string;
  checkedTooltipText?: string;
  unCheckedTooltipText?: string;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const UserCheckbox = ({
  colony,
  walletAddress,
  name,
  checkedTooltipText,
  unCheckedTooltipText,
}: Props) => {
  const userProfile = useUser(createAddress(walletAddress || AddressZero));
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: 'right' }) as any;

  const {
    profile: { displayName, username },
  } = userProfile;

  return (
    <div className={`${styles.main} ${!isChecked && styles.notChecked}`}>
      <div className={styles.user}>
        <div ref={setTriggerRef}>
          <Checkbox
            name={name}
            value={walletAddress}
            className={styles.checkbox}
            onChange={(props) => setIsChecked(props.isChecked)}
            getDefaultValue={(checked) => setIsChecked(checked)}
          />
          {visible && (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: tooltipStyles.tooltipContainer,
              })}
            >
              {isChecked ? checkedTooltipText : unCheckedTooltipText}
              <div
                {...getArrowProps({ className: tooltipStyles.tooltipArrow })}
              />
            </div>
          )}
        </div>
        <UserAvatar
          size="xs"
          colony={colony}
          address={walletAddress}
          user={userProfile}
          notSet={false}
        />
        <div className={styles.usernameSection}>
          {displayName && (
            <span className={styles.displayName} title={displayName}>
              {displayName}
            </span>
          )}
          {username && (
            <span className={styles.username}>
              <UserMention hasLink={false} username={username} />
            </span>
          )}
          <div className={styles.address}>
            <InvisibleCopyableAddress address={walletAddress}>
              <MaskedAddress address={walletAddress} />
            </InvisibleCopyableAddress>
          </div>
        </div>
      </div>
    </div>
  );
};

UserCheckbox.displayName = 'UserCheckbox';

export default UserCheckbox;
