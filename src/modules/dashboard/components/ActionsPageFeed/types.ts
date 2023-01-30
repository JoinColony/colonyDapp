import { MessageDescriptor } from 'react-intl';
import { UniversalMessageValues } from '~types/index';
import { Appearance as SystemInfoAppearance } from './ActionsPageSystemInfo';

export { EventValues, FeedItemWithId, FeedItems } from './ActionsPageFeed';

export enum ActionsPageFeedType {
  /*
   * Events coming from the contracts
   */
  NetworkEvent = 'NetworkEvent',
  /*
   * Comments for the various transactions that are coming from our server
   */
  ServerComment = 'TransactionMessage',
  /*
   * Random tips we can show in the feed
   * Like the ones in Recovery Mode
   */
  SystemInfo = 'SystemInfo',
  /*
   * Automated messages displayed by the dapp at certain treshholds
   * We currently use this to show when the required number
   * of recovery role users approved exiting the current recovery session
   */
  SystemMessage = 'SystemMessage',
}

export interface SystemInfo {
  type: ActionsPageFeedType.SystemInfo;
  text: MessageDescriptor | string;
  /*
   * Used to determine where to inser the system info item in the feed
   */
  position: number;
  textValues?: UniversalMessageValues;
  appearance?: SystemInfoAppearance;
}

/*
 * This list will get longer once we add more system events to the dapp
 */
export enum SystemMessagesName {
  EnoughExitRecoveryApprovals = 'EnoughExitRecoveryApprovals',
  MotionHasPassed = 'MotionHasPassed',
  MotionHasFailedNotFinalizable = 'MotionHasFailedNotFinalizable',
  MotionHasFailedFinalizable = 'MotionHasFailedFinalizable',
  MotionRevealPhase = 'MotionRevealPhase',
  MotionVotingPhase = 'MotionVotingPhase',
  MotionFullyStaked = 'MotionFullyStaked',
  MotionFullyStakedAfterObjection = 'MotionFullyStakedAfterObjection',
  ObjectionFullyStaked = 'ObjectionFullyStaked',
  MotionRevealResultObjectionWon = 'MotionRevealResultObjectionWon',
  MotionRevealResultMotionWon = 'MotionRevealResultMotionWon',
  MotionCanBeEscalated = 'MotionCanBeEscalated',

  ExpenditureStaked = 'ExpenditureStaked',
  ExpenditureCreatedDraft = 'ExpenditureCreatedDraft',
  ExpenditureCancelledDraft = 'ExpenditureCancelledDraft',
  ExpenditureClaimedStake = 'ExpenditureClaimedStake',
  ExpenditureLocked = 'ExpenditureLocked',
  ExpenditureModified = 'ExpenditureModified',
  ExpenditureMotionModified = 'ExpenditureMotionModified',
  ExpenditureOwnerChange = 'ExpenditureOwnerChange',
  ExpenditureMotionOwnerChange = 'ExpenditureMotionOwnerChange',
  ExpenditureFunding = 'ExpenditureFunding',
  ExpenditureMotionFunding = 'ExpenditureMotionFunding',
  ExpenditureFunded = 'ExpenditureFunded',
  ExpenditureReleaseFunds = 'ExpenditureReleaseFunds',
  ExpenditureFundsClaimed = 'ExpenditureFundsClaimed',
  ExpenditureAllFundsClaimed = 'ExpenditureAllFundsClaimed',

  IncorporationCreated = 'IncorporationCreated',
  IncorporationStaked = 'IncorporationStaked',
  IncorporationOwnerOrForceEdit = 'IncorporationOwnerOrForceEdit',
  IncorporationMotionModified = 'IncorporationMotionModified',
  IncorporationMotionPayment = 'IncorporationMotionPayment',
  IncorporationFailedMotionPayment = 'IncorporationFailedMotionPayment',
  IncorporationPassedMotionPayment = 'IncorporationPassedMotionPayment',
  IncorporationWaitingOnIndemnityForms = 'IncorporationWaitingOnIndemnityForms',
  IncorporationCompleted = 'IncorporationCompleted',
}

export interface SystemMessage {
  type: ActionsPageFeedType.SystemMessage;
  name: SystemMessagesName;
  createdAt: number;
}
