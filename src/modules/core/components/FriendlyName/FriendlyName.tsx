import React, { useRef, useEffect } from 'react';
import { AddressZero } from 'ethers/constants';

import { isEmpty } from 'lodash';
import MaskedAddress from '~core/MaskedAddress';

import { AnyUser, Colony } from '~data/index';

import { removeValueUnits } from '~utils/css';

import styles from './FriendlyName.css';

const displayName = 'FriendlyName';

interface Props {
  /*
   * The user object to display
   */
  user?: AnyUser;
  /*
   * Whether to show a masked address or a full one
   */
  maskedAddress?: boolean;
  /*
   * Whether to apply the "shrink tech font by 1px" logic
   */
  autoShrinkAddress?: boolean;
  /*
   * Colony object to display in case of wallet address is equal to colony address
   */
  colony?: Colony;
}

const FriendlyName = ({
  user,
  maskedAddress = true,
  autoShrinkAddress = false,
  colony,
}: Props) => {
  const addressRef = useRef<HTMLElement>(null);
  let colonyDisplay: string | undefined | null = '';
  let userDisplay: string | undefined | null = '';
  let colonyDisplayAddress: string | undefined | null = '';
  let userDisplayAddress: string | undefined | null = '';

  if (user?.profile) {
    const {
      profile: { username, displayName: userDisplayName, walletAddress },
    } = user;
    userDisplay = userDisplayName || username;
    if (walletAddress !== AddressZero) {
      userDisplayAddress = walletAddress;
    }
  }

  if (colony) {
    const {
      colonyName,
      displayName: colonyDisplayName,
      colonyAddress,
    } = colony;
    colonyDisplay = colonyDisplayName || colonyName;
    if (colonyAddress !== AddressZero) {
      colonyDisplayAddress = colonyAddress;
    }
  }

  /*
   * @NOTE On touching element styles manually
   * The "tech" font we user renders a bit larger than our display font while
   * using the same font size.
   *
   * Since we don't really know the size this element is going to be styled with
   * we can't determine the correct font size from the css styles directly.
   *
   * To solve this, we are fetching the computed styles of the address element,
   * getting the font size, subtracting one (it's usually enough to make it look
   * the same size as the other fonts), then applying it.
   *
   * So as, an overview, we always make (for this component only), the address
   * size to be 1px smaller than the rest of the text
   */
  useEffect(() => {
    if (autoShrinkAddress && addressRef?.current) {
      const computedStyles = getComputedStyle(addressRef.current);
      const inheritedFontSize = removeValueUnits(computedStyles.fontSize);
      addressRef.current.style.fontSize = `${inheritedFontSize - 1}px`;
    }
  }, [addressRef, autoShrinkAddress]);
  const isColony =
    user?.profile.walletAddress === colony?.colonyAddress ||
    (isEmpty(user) && !isEmpty(colony));
  return (
    <div className={styles.main}>
      <div className={styles.name}>
        {userDisplay || (isColony && colonyDisplay) || (
          <MaskedAddress
            address={userDisplayAddress || colonyDisplayAddress}
            full={!maskedAddress}
            ref={addressRef}
          />
        )}
      </div>
    </div>
  );
};

FriendlyName.displayName = displayName;

export default FriendlyName;
