import React from 'react';
import { isEmpty } from 'lodash';

import { AnyToken } from '~data/index';

import TokenInfo from './TokenInfo';
import NotAvailableMessage from './NotAvailableMessage';

import styles from './InfoPopover.css';

interface Props {
  token?: AnyToken;
  isTokenNative: boolean;
}

const displayName = 'InfoPopover.TokenInfoPopover';

const TokenInfoPopover = ({ token, isTokenNative }: Props) => {
  return (
    <>
      {!isEmpty(token) && token ? (
        <TokenInfo token={token} isTokenNative={isTokenNative} />
      ) : (
        <div className={styles.section}>
          <NotAvailableMessage notAvailableDataName="Token" />
        </div>
      )}
    </>
  );
};

TokenInfoPopover.displayName = displayName;

export default TokenInfoPopover;
