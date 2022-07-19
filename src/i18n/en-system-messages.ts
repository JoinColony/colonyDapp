/* eslint-disable max-len */

import { SystemMessagesName } from '~dashboard/ActionsPageFeed';

const systemMessagesMessageDescriptors = {
  'systemMessage.title': `{name, select,
      ${SystemMessagesName.EnoughExitRecoveryApprovals} {Enough permission holders have now signed to exit recovery mode. As long as no further storage slots are updated, a recovery permission holder may now sign a transaction to reactivate the colony.}
      ${SystemMessagesName.MotionHasPassed} {{motionTag} has {passedTag} and may be finalized.}
      ${SystemMessagesName.MotionRevealPhase} {It's time to {revealTag} votes to the world!}
      ${SystemMessagesName.MotionHasFailedNotFinalizable} {{motionTag} has failed.}
      ${SystemMessagesName.MotionHasFailedFinalizable} {{motionTag} has {failedTag} and may be finalized.}
      ${SystemMessagesName.MotionVotingPhase} {{votingTag} has started! Voting is secret 🤫, and weighted by Reputation.}
      ${SystemMessagesName.MotionFullyStaked} {{motionTag} is fully staked; Staking period has reset. As long as there is no {objectionTag} , the motion will pass.}
      ${SystemMessagesName.MotionFullyStakedAfterObjection} {{motionTag} is fully staked.}
      ${SystemMessagesName.ObjectionFullyStaked} {{objectionTag} is fully staked; Staking period has reset. If the {motionTag} gets fully staked, a vote will start immediately; if not, the {motionTag} will fail.}
      ${SystemMessagesName.MotionRevealResultObjectionWon} {{motionTag} failed. {voteResultsWidget} The motion will fail at the end of the escalation period unless the dispute is escalated to a higher team.}
      ${SystemMessagesName.MotionRevealResultMotionWon} {{motionTag} passed! {voteResultsWidget} The motion will pass at the end of the escalation period unless the dispute is escalated to a higher team.}
      ${SystemMessagesName.MotionCanBeEscalated} {{escalateTag} period started. {spaceBreak}{spaceBreak} If you believe this result was unfair, and would be different if more people were involved, you may escalate it to a higher team.}

      ${SystemMessagesName.ExpenditureStaked} {{user} {reputation} staked {amount} to create a draft expenditure; they can change parameters until they lock the expenditure.}
      ${SystemMessagesName.ExpenditureCreatedDraft} {{user} {reputation} created a draft expenditure; they can change parameters until they lock the expenditure.}
      ${SystemMessagesName.ExpenditureCancelledDraft} {{user} {reputation} cancelled this draft expenditure and may reclaim their stake.}
      ${SystemMessagesName.ExpenditureClaimedStake} {{user} {reputation} reclaimed their stake.}
      ${SystemMessagesName.ExpenditureLocked} {{user} {reputation} locked the expenditure. Parameters can be modified by either a motion, or a member with the /"Arbitration/" permission until the funds have been claimed.}
      ${SystemMessagesName.ExpenditureModified} {{user} {reputation} changed the expenditure. {changes}}
      ${SystemMessagesName.ExpenditureMotionModified} {{user} {reputation} created a motion to change the expenditure. {changes}}
      ${SystemMessagesName.ExpenditureOwnerChange} {{user} {reputation} changed the owner of this expenditure to {recipient}.}
      ${SystemMessagesName.ExpenditureMotionOwnerChange} {{user} {reputation} created a motion to change the owner of this expenditure to {recipient}.}
      ${SystemMessagesName.ExpenditureFunding} {{user} {reputation} added funding of {funds}}
      ${SystemMessagesName.ExpenditureMotionFunding} {{user} {reputation} created a motion to fund this expenditure with {founds}.}
      ${SystemMessagesName.ExpenditureFunded} {The expenditure is fully funded. {user} may release the funds when appropriate.}
      ${SystemMessagesName.ExpenditureReleaseFunds} {{user} {reputation} released the funds. Funds may be claimed after the security delay.}
      ${SystemMessagesName.ExpenditureFundsClaimed} {{user} {reputation} claimed their funds of {funds}.}
      ${SystemMessagesName.ExpenditureAllFundsClaimed} {All funds have been claimed.}
      other {Generic system message}
    }`,
  /*
   * Changes needs to be declared separely since we can't nest select declarations
   */
  [`systemMessage.change.recipient`]: `{prevState} recipient was changed to {recipient}`,
  [`systemMessage.change.value`]: `value was changed to {value}`,
  [`systemMessage.change.claimDelay`]: `claim delay was changed to {value}`,
};

export default systemMessagesMessageDescriptors;
