import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './MemberInfoPopover.css';
import Heading from '~core/Heading';
import MemberReputation from '~core/MemberReputation';

const displayName = `InfoPopover.MemberInfoPopover.UserReputation`;

interface Props {
  walletAddress: string;
  colonyAddress: string;
}

const MSG = defineMessages({
  labelText: {
    id: 'InfoPopover.MemberInfoPopover.UserReputation.labelText',
    defaultMessage: 'Reputation',
  },
  noReputationDescription: {
    id: 'InfoPopover.MemberInfoPopover.descriptionReputation',
    defaultMessage: `You don’t have any reputation now.\nTo earn reputation you need to contribute to the colony.`,
  },
});

const UserReputation = ({ walletAddress, colonyAddress }: Props) => {
  return (
    <div className={styles.reputationContainer}>
      <div>
        <Heading
          appearance={{
            size: 'normal',
            margin: 'none',
            theme: 'grey',
            weight: 'bold',
          }}
          text={MSG.labelText}
        />
        <p className={styles.noReputationDescription}>
          <FormattedMessage {...MSG.noReputationDescription} />
        </p>
      </div>
      <ul>
        <li className={styles.domainReputationItem}>
          <p className={styles.domainName}>Root</p>
          <MemberReputation
            walletAddress={walletAddress}
            colonyAddress={colonyAddress}
          />
        </li>
      </ul>
    </div>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
