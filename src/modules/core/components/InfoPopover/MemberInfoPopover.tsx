import React from 'react';
import { isEmpty } from 'lodash';

import { AnyUser } from '~data/index';
import { Address } from '~types/index';

import MemberInfo from './MemberInfo';
import NotAvailableMessage from './NotAvailableMessage';

import styles from './InfoPopover.css';

interface Props {
  colonyAddress: Address;
  domainId?: number;
  user?: AnyUser;
}

const displayName = 'InfoPopover.MemberInfoPopover';

const MemberInfoPopover = ({ colonyAddress, domainId, user }: Props) => {
  return (
    <>
      {!isEmpty(user?.profile?.walletAddress) ? (
        <MemberInfo
          colonyAddress={colonyAddress}
          domainId={domainId}
          user={user}
        />
      ) : (
        <div className={styles.section}>
          <NotAvailableMessage notAvailableDataName="Member" />
        </div>
      )}
    </>
  );
};

MemberInfoPopover.displayName = displayName;

export default MemberInfoPopover;
