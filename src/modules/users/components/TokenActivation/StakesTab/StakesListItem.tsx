import React, { Dispatch, SetStateAction } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~core/Link';

import styles from './StakesTab.css';

const MSG = defineMessages({
  motionUrl: {
    id: 'TokenActivation.StakesTab.StakesListItem.motionUrl',
    defaultMessage: 'Go to motion',
  },
});
interface StakesListItemProps {
  stakedAmount?: string;
  tokenSymbol?: string;
  colonyName?: string;
  txHash?: string;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const StakesListItem = ({
  stakedAmount,
  tokenSymbol,
  colonyName,
  txHash,
  setIsPopoverOpen,
}: StakesListItemProps) => {
  return (
    <li className={styles.stakesListItem}>
      <Link to={`/colony/${colonyName}/tx/${txHash}`}>
        <div
          role="button"
          // 'any' used to stop warnings about MouseEvent incompatible types
          onClick={setIsPopoverOpen as any}
          onKeyPress={setIsPopoverOpen as any}
          tabIndex={0}
        >
          <p>
            <span>
              {stakedAmount} {tokenSymbol}
            </span>
          </p>
          <div className={styles.falseLink}>
            <FormattedMessage {...MSG.motionUrl} />
          </div>

          {/* {colonyName && txHash && (
          <Link
            className={styles.link}
            text={MSG.motionUrl}
            to={`/colony/${colonyName}/tx/${txHash}`}
          />
        )} */}
        </div>
      </Link>
    </li>
  );
};

export default StakesListItem;
