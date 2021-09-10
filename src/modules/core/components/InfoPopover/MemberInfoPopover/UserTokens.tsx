import React from 'react';
import { defineMessages } from 'react-intl';
import { BigNumberish } from 'ethers/utils';

import Heading from '~core/Heading';
import { getFormattedTokenValue } from '~utils/tokens';

import Numeral from '~core/Numeral';
import { UserToken } from '~data/generated';
import TokenIcon from '~dashboard/HookedTokenIcon';

import styles from './MemberInfoPopover.css';

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
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      <div className={styles.tokenAmount}>
        <TokenIcon token={nativeToken} name={nativeToken.name} size="xxs" />
        <Numeral
          suffix={` ${nativeToken.symbol} `}
          value={formattedTotalBalance}
        />
      </div>
    </div>
  );
};

UserTokens.displayName = displayName;

export default UserTokens;
