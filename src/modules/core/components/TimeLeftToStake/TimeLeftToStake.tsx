import React from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

// import TimeAgo from 'react-timeago';

import { useVotingExtensionParamsQuery } from '~data/index';
import { Address } from '~types/index';

import TimeLeft from './TimeLeft';
import styles from './TimeLeftToStake.css';

const MSG = defineMessage({
  difference: {
    id: 'TimeLeftToStake.TimeLeftToStake.difference',
    defaultMessage: 'Time left to stake ',
  },
});

interface Props {
  createdAt: number;
  colonyAddress: Address;
}

const TimeLeftToStake = ({ colonyAddress, createdAt }: Props) => {
  const { data } = useVotingExtensionParamsQuery({
    variables: { colonyAddress },
  });

  const stakePeriod = data?.votingExtensionParams.stakePeriod || 0;

  return (
    <div className={styles.container}>
      <FormattedMessage {...MSG.difference} />
      <TimeLeft createdAt={createdAt} stakePeriod={stakePeriod} />
    </div>
  );
};

export default TimeLeftToStake;
