export enum ColonyMotions {
  /*
    I dont like Motion postfitx, but if we would use actionType for
    both motions and actions we need to have something distinct
  */
  MintTokensMotion = 'MintTokensMotion',
  PaymentMotion = 'PaymentMotion',
  UnlockTokenMotion = 'UnlockTokenMotion',
  CreateDomainMotion = 'CreateDomainMotion',
  EditDomainMotion = 'EditDomainMotion',
  ColonyEditMotion = 'ColonyEditMotion',
  SetUserRolesMotion = 'SetUserRolesMotion',
  MoveFundsMotion = 'MoveFundsMotion',
  VersionUpgradeMotion = 'VersionUpgradeMotion',
  EmitDomainReputationPenaltyMotion = 'EmitDomainReputationPenaltyMotion',
  EmitDomainReputationRewardMotion = 'EmitDomainReputationRewardMotion',
  CreateDecisionMotion = 'CreateDecisionMotion',
  NullMotion = 'NullMotion',
}

export enum AddedMotions {
  SafeTransactionInitiatedMotion = 'SafeTransactionInitiatedMotion',
}

export const ColonyExtendedMotions = { ...ColonyMotions, ...AddedMotions };

export const motionNameMapping = {
  mintTokens: ColonyMotions.MintTokensMotion,
  makePaymentFundedFromDomain: ColonyMotions.PaymentMotion,
  unlockToken: ColonyMotions.UnlockTokenMotion,
  addDomain: ColonyMotions.CreateDomainMotion,
  editDomain: ColonyMotions.EditDomainMotion,
  editColony: ColonyMotions.ColonyEditMotion,
  setUserRoles: ColonyMotions.SetUserRolesMotion,
  moveFundsBetweenPots: ColonyMotions.MoveFundsMotion,
  upgrade: ColonyMotions.VersionUpgradeMotion,
  emitDomainReputationPenalty: ColonyMotions.EmitDomainReputationPenaltyMotion,
  emitDomainReputationReward: ColonyMotions.EmitDomainReputationRewardMotion,
  createDecision: ColonyMotions.CreateDecisionMotion,
  nullMotion: ColonyMotions.NullMotion,
  makeArbitraryTransactions: AddedMotions.SafeTransactionInitiatedMotion,
};

export enum ColonyMotionActionName {
  AddDomain = 'addDomain',
  EditColony = 'editColony',
  CreateDecision = 'createDecision',
}
