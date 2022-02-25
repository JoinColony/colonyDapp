import React, { MouseEvent } from 'react';
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
  // setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopoverOpen: () => void;
}

const StakesListItem = ({
  stakedAmount,
  tokenSymbol,
  colonyName,
  txHash,
  setIsPopoverOpen,
}: StakesListItemProps) => {
  // const handleSyntheticEvent = useCallback(() => {
  //   // setIsPopoverOpen(false);
  //   console.log('got here');
  // }, [setIsPopoverOpen]);
  const clickHandler = (e: React.MouseEvent) => {
    console.log('ClickHandler called');
    setIsPopoverOpen();
  };
  return (
    <li>
      <Link to={`/colony/${colonyName}/tx/${txHash}`}>
        <div
          role="button"
          onClick={clickHandler}
          onKeyPress={clickHandler}
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
