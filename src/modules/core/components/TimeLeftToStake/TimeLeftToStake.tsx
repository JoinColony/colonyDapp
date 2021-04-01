import React from 'react';
import {
  FormattedMessage,
  FormattedRelativeTime,
  defineMessage,
} from 'react-intl';

import { useVotingExtensionParamsQuery } from '~data/index';
import { Address } from '~types/index';

import styles from './TimeLeftToStake.css';

const MSG = defineMessage({
  timeLeft: {
    id: 'TimeLeftToStake.timeLeft',
    defaultMessage: 'Time left to stake ',
  },
});

interface Props {
  createdAt: number;
  colonyAddress: Address;
}

const TimeLeftToStake = ({ colonyAddress }: Props) => {
  const { data } = useVotingExtensionParamsQuery({
    variables: { colonyAddress },
  });

  const stakePeriod = data?.votingExtensionParams.stakePeriod;

  return (
    <div className={styles.container}>
      <FormattedMessage {...MSG.timeLeft} />
      <span className={styles.time}>
        <FormattedRelativeTime
          updateIntervalInSeconds={1}
          value={stakePeriod as number}
          numeric="auto"
        />
      </span>
    </div>
  );
};

export default TimeLeftToStake;
