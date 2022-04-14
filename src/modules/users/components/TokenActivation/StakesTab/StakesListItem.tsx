import React, { Dispatch, SetStateAction } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~core/Link';
import Numeral from '~core/Numeral';

import styles from './StakesTab.css';

const MSG = defineMessages({
  motionUrl: {
    id: 'users.TokenActivation.StakesTab.StakesListItem.motionUrl',
    defaultMessage: 'Go to motion',
  },
});
interface Props {
  stakedAmount: string;
  tokenSymbol: string;
  colonyName: string;
  txHash: string;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const StakesListItem = ({
  stakedAmount,
  tokenSymbol,
  colonyName,
  txHash,
  setIsPopoverOpen,
}: Props) => {
  return (
    <li className={styles.stakesListItem}>
      <Link to={`/colony/${colonyName}/tx/${txHash}`}>
        <div
          role="button"
          // 'any' used to stop warnings about MouseEvent incompatible types
          onClick={setIsPopoverOpen as any}
          onKeyPress={setIsPopoverOpen as any}
          tabIndex={0}
          data-test="goToMotion"
        >
          <div>
            <Numeral value={stakedAmount} suffix={tokenSymbol} />
          </div>
          <div className={styles.falseLink}>
            <FormattedMessage {...MSG.motionUrl} />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default StakesListItem;
