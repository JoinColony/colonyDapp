/* eslint-disable max-len */

import { SystemMessagesName } from '~dashboard/ActionsPageFeed';

const systemMessagesMessageDescriptors = {
  'systemMessage.title': `{name, select,
      ${SystemMessagesName.EnoughExitRecoveryApprovals} {Enough permission holders have now signed to exit recovery mode. As long as no further storage slots are updated, a recovery permission holder may now sign a transaction to reactivate the colony.}
      ${SystemMessagesName.MotionHasPassed} {{motionTag} has {passedTag} and may be finalized.}
      ${SystemMessagesName.MotionRevealPhase} {It's time to {revealTag} votes to the world!}
      ${SystemMessagesName.MotionHasFailedNotFinalizable} {{motionTag} has failed.}
      ${SystemMessagesName.MotionHasFailedFinalizable} {{motionTag} has {failedTag} and may be finalized.}
      ${SystemMessagesName.MotionVotingPhase} {{votingTag} has started! Voting is secret 😀, and weighted by Reputation.}
      ${SystemMessagesName.MotionFullyStaked} {{motionTag} is fully staked; Staking period has reset. As long as there is no {objectionTag} , the motion will pass.}
      ${SystemMessagesName.MotionRevealResultObjectionWon} {{objectionTag} sustained! {voteResultsWidget} The motion will fail at the end of the escalation period unless the dispute is escalated to a higher domain.}
      ${SystemMessagesName.MotionRevealResultMotionWon} {{motionTag} sustained! {voteResultsWidget} The motion will pass at the end of the escalation period unless the dispute is escalated to a higher domain.}
      other {Generic system message}
    }`,
};

export default systemMessagesMessageDescriptors;
