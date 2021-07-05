import React from 'react';
import { defineMessages } from 'react-intl';
import { bigNumberify } from 'ethers/utils';

import { MiniSpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useLoggedInUser,
  useMotionVoteResultsQuery,
} from '~data/index';

import VoteResultsItem from './VoteResultsItem';

import styles from './VoteResults.css';

interface Props {
  colony: Colony;
  motionId: number;
}

const MSG = defineMessages({
  voteYAY: {
    id: `dashboard.ActionsPage.FinalizeMotionAndClaimWidget.VoteResults.voteYAY`,
    defaultMessage: `Yes`,
  },
  voteNAY: {
    id: `dashboard.ActionsPage.FinalizeMotionAndClaimWidget.VoteResults.voteNAY`,
    defaultMessage: `No!`,
  },
  loadingText: {
    id: `dashboard.ActionsPage.FinalizeMotionAndClaimWidget.VoteResults.loadingText`,
    defaultMessage: 'Loading votes results',
  },
});

const VoteResults = ({ colony: { colonyAddress }, motionId }: Props) => {
  const { walletAddress: userAddress } = useLoggedInUser();
  const { data, loading } = useMotionVoteResultsQuery({
    variables: {
      colonyAddress,
      userAddress,
      motionId,
    },
  });

  /*
   * @TODO add proper loading state
   */
  if (loading || !data?.motionVoteResults) {
    return (
      <div className={styles.main}>
        <MiniSpinnerLoader loadingText={MSG.loadingText} />
      </div>
    );
  }

  const {
    yayVoters = [],
    yayVotes,
    nayVoters = [],
    nayVotes,
  } = data?.motionVoteResults;

  const yayVotesValue = bigNumberify(yayVotes)
    .div(bigNumberify(10).pow(18))
    .toNumber();
  const nayVotesValue = bigNumberify(nayVotes)
    .div(bigNumberify(10).pow(18))
    .toNumber();
  /*
   * That moment when you have to do percentage math in plain JS because
   * BigNumber is afraid of floating point
   *
   * Also, we need to round the values in order to not have off by one (or two)
   * errors when visually approximating the percentages
   */
  const totalVotes = yayVotesValue + nayVotesValue;
  const yayVotePercent = Math.round((yayVotesValue / totalVotes) * 100);
  const nayVotePercent = Math.round((nayVotesValue / totalVotes) * 100);

  return (
    <div className={styles.main}>
      <div className={styles.firstVoteResult}>
        <VoteResultsItem
          value={yayVotePercent}
          maxValue={100}
          title={MSG.voteYAY}
          voters={yayVoters as string[]}
        />
      </div>
      <VoteResultsItem
        value={nayVotePercent}
        maxValue={100}
        title={MSG.voteNAY}
        appearance={{ theme: 'disapprove' }}
        voters={nayVoters as string[]}
      />
    </div>
  );
};

VoteResults.displayName =
  'dashboard.ActionsPage.FinalizeMotionAndClaimWidget.VoteResults';

export default VoteResults;
