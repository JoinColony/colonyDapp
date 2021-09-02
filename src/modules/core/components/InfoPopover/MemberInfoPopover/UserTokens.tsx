import React from 'react';
import { defineMessages } from 'react-intl';
import { BigNumberish } from 'ethers/utils';

import Heading from '~core/Heading';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './MemberInfoPopover.css';
import Numeral from '~core/Numeral';
import { UserToken } from '~data/generated';

const displayName = `InfoPopover.MemberInfoPopover.UserTokens`;

interface Props {
  totalBalance: BigNumberish;
  nativeToken: UserToken;
}

const MSG = defineMessages({
  labelText: {
    id: 'InfoPopover.MemberInfoPopover.UserTokens.labelText',
    defaultMessage: 'Tokens',
  },
});

const UserTokens = ({ totalBalance, nativeToken }: Props) => {
  const formattedTotalBalance = getFormattedTokenValue(
    totalBalance,
    nativeToken.decimals,
  );

  return (
    <div className={styles.sectionContainer}>
      <Heading
        appearance={{
          size: 'normal',
          margin: 'none',
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      <p className={styles.tokenAmount}>
        <Numeral
          suffix={` ${nativeToken.symbol} `}
          value={formattedTotalBalance}
        />
      </p>
    </div>
  );
};

UserTokens.displayName = displayName;

export default UserTokens;
