import React from 'react';

import ColorTag, { Color } from '~core/ColorTag';
import Heading from '~core/Heading';
import { OneDomain, AnyUser } from '~data/index';
import { Address } from '~types/index';
import MemberReputation from '~core/MemberReputation';

import styles from './TeamDropdownItem.css';

interface Props {
  domain: OneDomain;
  colonyAddress: Address;
  user?: AnyUser;
}

const displayName = `dashboard.SmiteDialog.TeamDropdownItem`;

const TeamDropdownItem = ({
  domain: { color = Color.LightPink, ethDomainId, name },
  colonyAddress,
  user,
}: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.color}>
        <ColorTag color={color} />
      </div>
      <div className={styles.headingWrapper}>
        <Heading
          appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
          text={name}
        />
      </div>
      {user && (
        <MemberReputation
          walletAddress={user.id}
          colonyAddress={colonyAddress}
          domainId={ethDomainId}
        />
      )}
    </div>
  );
};

TeamDropdownItem.displayName = displayName;

export default TeamDropdownItem;
