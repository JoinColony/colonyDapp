import { Address } from './index';

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
  TaskAdded = 'TaskAdded',
  TaskBriefSet = 'TaskBriefSet',
  TaskDueDateSet = 'TaskDueDateSet',
  TaskSkillSet = 'TaskSkillSet',
  TaskRoleUserSet = 'TaskRoleUserSet',
  TaskPayoutSet = 'TaskPayoutSet',
  TaskChangedViaSignatures = 'TaskChangedViaSignatures',
  TaskDeliverableSubmitted = 'TaskDeliverableSubmitted',
  TaskCompleted = 'TaskCompleted',
  TaskWorkRatingRevealed = 'TaskWorkRatingRevealed',
  TaskFinalized = 'TaskFinalized',
  TaskCanceled = 'TaskCanceled',
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
}

export interface FormattedAction {
  id: string;
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
}

export interface FormattedEvent {
  id: string;
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
}
