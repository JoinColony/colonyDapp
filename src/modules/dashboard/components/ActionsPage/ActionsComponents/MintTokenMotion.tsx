import React from 'react';

import { defineMessage, FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import { ActionsPageFeedItem } from '~dashboard/ActionsPageFeed';
import { ColonyMotions } from '~types/index';
import {
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
} from '~data/index';
import Tag from '~core/Tag';
import FriendlyName from '~core/FriendlyName';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import DetailsWidget from '../DetailsWidget';
import styles from './DefaultAction.css';

const displayName = 'dashboard.ActionsPage.MintTokenMotion';

const MSG = defineMessage({
  motionTag: {
    id: 'dashboard.ActionsPage.MintTokenMotion.tag',
    defaultMessage: 'Motion',
  },
});

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

const MintTokenMotion = ({
  colony,
  colonyAction: {
    createdAt: actionCreatedAt,
    actionType,
    annotationHash,
    colonyDisplayName,
    amount,
    motionState,
  },
  token: { decimals, symbol },
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const actionAndEventValues = {
    actionType,
    amount: (
      <Numeral value={amount} unit={getTokenDecimalsWithFallback(decimals)} />
    ),
    tokenSymbol: <span>{symbol || '???'}</span>,
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={initiator} autoShrinkAddress />
      </span>
    ),
    colonyName: (
      <FriendlyName
        colony={{
          ...colony,
          ...(colonyDisplayName ? { displayName: colonyDisplayName } : {}),
        }}
        autoShrinkAddress
      />
    ),
  };
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <p className={styles.tagWrapper}>
          {/* Make it dynamic */}
          <Tag text={MSG.motionTag} appearance={{ theme: 'primary' }} />
        </p>
      </div>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <FormattedMessage
              id="motion.title"
              values={{
                ...actionAndEventValues,
              }}
            />
          </h1>
          {annotationHash && (
            <ActionsPageFeedItem
              createdAt={actionCreatedAt}
              user={initiator}
              annotation
              comment={annotationHash}
            />
          )}
        </div>
        <div className={styles.details}>
          <DetailsWidget
            actionType={actionType as ColonyMotions}
            recipient={recipient}
            transactionHash={transactionHash}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

MintTokenMotion.displayName = displayName;

export default MintTokenMotion;
