import React, { useLayoutEffect, useRef, useState } from 'react';
import { defineMessages } from 'react-intl';

import { UserToken } from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';
import ExternalLink from '~core/ExternalLink';
import { CM_LEARN_MORE } from '~externalUrls';

import styles from './StakesTab.css';
import tokenStyles from '../TokenActivationContent/TokenActivationContent.css';

const MSG = defineMessages({
  motionUrl: {
    id: 'users.TokenActivation.TokenActivationContent.StakesListItem.motionUrl',
    defaultMessage: 'Go to motion',
  },
});

interface Props {
  token?: UserToken;
  item: number;
  key?: number;
}

const StakesListItem = ({ token, item }: Props) => {
  const [totalTokensWidth, setTotalTokensWidth] = useState(0);
  const widthLimit = 164;

  const targetRef = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    if (targetRef?.current && totalTokensWidth === 0) {
      setTotalTokensWidth(targetRef?.current?.offsetWidth);
    }
  }, [totalTokensWidth]);

  const totalTokens = item;
  const formattedTotalAmount = getFormattedTokenValue(
    totalTokens,
    token?.decimals,
  );

  const tokenSymbolStyle =
    totalTokensWidth <= widthLimit
      ? tokenStyles.tokenSymbol
      : tokenStyles.tokenSymbolSmall;
  return (
    <li className={styles.stakesListItem}>
      <div>
        <p ref={targetRef} className={tokenSymbolStyle}>
          {formattedTotalAmount} <span>{token?.symbol}</span>
        </p>
        <ExternalLink
          className={styles.link}
          text={MSG.motionUrl}
          href={CM_LEARN_MORE}
        />
      </div>
    </li>
  );
};

export default StakesListItem;
