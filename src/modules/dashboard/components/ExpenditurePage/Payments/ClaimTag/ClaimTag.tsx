import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Tag from '~core/Tag';
import TimeRelativeShort from '~dashboard/ExpenditurePage/TimeRelativeShort';
import { State } from '~pages/ExpenditurePage/ExpenditurePage';

import styles from './ClaimTag.css';

const MSG = defineMessages({
  claim: {
    id: 'dashboard.ExpenditurePage.Payments.ClaimTag.claim',
    defaultMessage: 'Claim',
  },
  claimed: {
    id: 'dashboard.ExpenditurePage.Payments.ClaimTag.claimed',
    defaultMessage: 'Claimed',
  },
  claimNow: {
    id: 'dashboard.ExpenditurePage.Payments.ClaimTag.claimNow',
    defaultMessage: 'Claim now',
  },
});

const displayName = 'dashboard.ExpenditurePage.Payments.ClaimTag';

interface Props {
  claimDate: number | null;
  claimed?: boolean;
  activeState?: State;
}
const ClaimTag = ({ claimDate, claimed, activeState }: Props) => {
  if (!claimDate) {
    return null;
  }

  const isClaimable = claimDate < new Date().getTime() && !claimed;

  if (isClaimable) {
    return (
      <Button
        className={styles.claimButton}
        onClick={activeState?.buttonAction}
      >
        <FormattedMessage {...MSG.claimNow} />
      </Button>
    );
  }
  if (claimed) {
    return (
      <div className={styles.claimedTagWrapper}>
        <Tag>
          <FormattedMessage {...MSG.claimed} />
        </Tag>
      </div>
    );
  }
  return (
    <div className={styles.tagWrapper}>
      <Tag
        appearance={{
          theme: 'golden',
          colorSchema: 'fullColor',
        }}
      >
        <FormattedMessage {...MSG.claim} />{' '}
        <TimeRelativeShort value={new Date(claimDate)} formatting="short" />
      </Tag>
    </div>
  );
};

ClaimTag.displayName = displayName;

export default ClaimTag;
