import React from 'react';
import { isEmpty } from 'lodash';

import { AnyToken } from '~data/index';

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
      {!isEmpty(token) ? (
        <TokenInfoPopover token={token} isTokenNative={isTokenNative} />
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
