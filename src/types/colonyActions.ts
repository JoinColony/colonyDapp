import { ColonyRole } from '@colony/colony-js';

import { ItemStatus } from '~core/ActionsList';
import { Address, ActionUserRoles } from './index';

export enum ColonyActions {
  Generic = 'Generic',
  WrongColony = 'WrongColony',
  Payment = 'Payment',
  Recovery = 'Recovery',
  MoveFunds = 'MoveFunds',
  MintTokens = 'MintTokens',
  CreateDomain = 'CreateDomain',
  VersionUpgrade = 'VersionUpgrade',
  ColonyEdit = 'ColonyEdit',
  EditDomain = 'EditDomain',
  SetUserRoles = 'SetUserRoles',
}

export enum ColonyAndExtensionsEvents {
  Generic = 'Generic',
  /*
   * Colony Events
   */
  ColonyFundsMovedBetweenFundingPots = 'ColonyFundsMovedBetweenFundingPots',
  FundingPotAdded = 'FundingPotAdded',
  PaymentAdded = 'PaymentAdded',
  PayoutClaimed = 'PayoutClaimed',
  TokensMinted = 'TokensMinted',
  SkillAdded = 'SkillAdded',
  DomainAdded = 'DomainAdded',
  DomainMetadata = 'DomainMetadata',
  PaymentPayoutSet = 'PaymentPayoutSet',
  ColonyUpgraded = 'ColonyUpgraded',
  ColonyMetadata = 'ColonyMetadata',
  ColonyInitialised = 'ColonyInitialised',
  ColonyBootstrapped = 'ColonyBootstrapped',
  ColonyFundsClaimed = 'ColonyFundsClaimed',
  ColonyRoleSet = 'ColonyRoleSet',
  RewardPayoutCycleStarted = 'RewardPayoutCycleStarted',
  RewardPayoutCycleEnded = 'RewardPayoutCycleEnded',
  RewardPayoutClaimed = 'RewardPayoutClaimed',
  ColonyRewardInverseSet = 'ColonyRewardInverseSet',
  ExpenditureAdded = 'ExpenditureAdded',
  ExpenditureTransferred = 'ExpenditureTransferred',
  ExpenditureCancelled = 'ExpenditureCancelled',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureRecipientSet = 'ExpenditureRecipientSet',
  ExpenditureSkillSet = 'ExpenditureSkillSet',
  ExpenditurePayoutSet = 'ExpenditurePayoutSet',
  Annotation = 'Annotation',
  PaymentSkillSet = 'PaymentSkillSet',
  PaymentRecipientSet = 'PaymentRecipientSet',
  PaymentFinalized = 'PaymentFinalized',
  TokensBurned = 'TokensBurned',
  /*
   * Network events
   */
  ColonyNetworkInitialised = 'ColonyNetworkInitialised',
  TokenLockingAddressSet = 'TokenLockingAddressSet',
  MiningCycleResolverSet = 'MiningCycleResolverSet',
  NetworkFeeInverseSet = 'NetworkFeeInverseSet',
  TokenWhitelisted = 'TokenWhitelisted',
  ColonyVersionAdded = 'ColonyVersionAdded',
  MetaColonyCreated = 'MetaColonyCreated',
  ColonyAdded = 'ColonyAdded',
  AuctionCreated = 'AuctionCreated',
  ReputationMiningInitialised = 'ReputationMiningInitialised',
  ReputationMiningCycleComplete = 'ReputationMiningCycleComplete',
  ReputationRootHashSet = 'ReputationRootHashSet',
  UserLabelRegistered = 'UserLabelRegistered',
  ColonyLabelRegistered = 'ColonyLabelRegistered',
  ReputationMinerPenalised = 'ReputationMinerPenalised',
  ExtensionAddedToNetwork = 'ExtensionAddedToNetwork',
  ExtensionInstalled = 'ExtensionInstalled',
  ExtensionInitialised = 'ExtensionInitialised',
  ExtensionUpgraded = 'ExtensionUpgraded',
  ExtensionDeprecated = 'ExtensionDeprecated',
  ExtensionUninstalled = 'ExtensionUninstalled',
  RecoveryRoleSet = 'RecoveryRoleSet',
  RecoveryModeEntered = 'RecoveryModeEntered',
  RecoveryModeExited = 'RecoveryModeExited',
  RecoveryStorageSlotSet = 'RecoveryStorageSlotSet',
  RecoveryModeExitApproved = 'RecoveryModeExitApproved',
  /*
   * Token events
   */
  Mint = 'Mint',
  Burn = 'Burn',
  LogSetAuthority = 'LogSetAuthority',
  LogSetOwner = 'LogSetOwner',
  Approval = 'Approval',
  Transfer = 'Transfer',
  /*
   * Extension: One Tx Payment events
   */
  OneTxPaymentMade = 'OneTxPaymentMade',
  /*
   * Extension: Coin Machine events
   */
  TokensBought = 'TokensBought',
  PeriodUpdated = 'PeriodUpdated',
  /*
   * Motion events
   */
  MotionCreated = 'MotionCreated',
  MotionStaked = 'MotionStaked',
  MotionVoteSubmitted = 'MotionVoteSubmitted',
  MotionVoteRevealed = 'MotionVoteRevealed',
  MotionFinalized = 'MotionFinalized',
  MotionEscalated = 'MotionEscalated',
  MotionRewardClaimed = 'MotionRewardClaimed',
  MotionEventSet = 'MotionEventSet',
}

export interface FormattedAction {
  id: string;
  status?: ItemStatus;
  actionType: ColonyActions;
  initiator: Address;
  recipient: Address;
  amount: string;
  tokenAddress: Address;
  symbol: string;
  decimals: string;
  fromDomain: string;
  toDomain: string;
  transactionHash: string;
  createdAt: Date;
  commentCount: number;
  metadata?: string;
  roles: ActionUserRoles[];
  oldVersion?: string;
  newVersion?: string;
}

export interface FormattedEvent {
  id: string;
  status?: ItemStatus;
  eventName: ColonyAndExtensionsEvents;
  colonyAddress: Address;
  agent: Address | null;
  recipient: Address;
  transactionHash: string;
  createdAt: Date;
  displayValues: string;
  domainId: string;
  fundingPot?: string;
  metadata?: string;
  tokenAddress?: string | null;
  paymentId?: string;
  decimals: number;
  amount: string;
  role: ColonyRole;
  setTo: boolean;
  extensionHash?: string;
  extensionVersion?: string;
  oldVersion?: string;
  newVersion?: string;
  storageSlot?: string;
  storageSlotValue?: string;
}
