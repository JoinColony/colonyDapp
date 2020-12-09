import React, { useRef, useEffect } from 'react';

import MaskedAddress from '~core/MaskedAddress';

import { AnyUser } from '~data/index';
import { removeValueUnits } from '~utils/css';

import styles from './FriendlyUserName.css';

const displayName = 'FriendlyUserName';

interface Props {
  user: AnyUser;
  maskedAddress?: boolean;
}

const FriendlyUserName = ({
  user: {
    profile: { displayName: userDisplayName, username, walletAddress },
  },
  maskedAddress = true,
}: Props) => {
  const addressRef = useRef<HTMLElement>(null);

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
    if (addressRef?.current) {
      const computedStyles = getComputedStyle(addressRef.current);
      const inheritedFontSize = removeValueUnits(computedStyles.fontSize);
      addressRef.current.style.fontSize = `${inheritedFontSize - 1}px`;
    }
  }, [addressRef]);
  return (
    <div className={styles.main}>
      {userDisplayName || (username && `@${username}`) || (
        <MaskedAddress
          address={walletAddress}
          full={!maskedAddress}
          ref={addressRef}
        />
      )}
    </div>
  );
};

FriendlyUserName.displayName = displayName;

export default FriendlyUserName;
