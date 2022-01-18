export enum ColonyMotions {
  /*
    I dont like Motion postfitx, but if we would use actionType for
    both motions and actions we need to have something distinct
  */
  MintTokensMotion = 'MintTokensMotion',
  PaymentMotion = 'PaymentMotion',
  CreateDomainMotion = 'CreateDomainMotion',
  EditDomainMotion = 'EditDomainMotion',
  ColonyEditMotion = 'ColonyEditMotion',
  SetUserRolesMotion = 'SetUserRolesMotion',
  MoveFundsMotion = 'MoveFundsMotion',
  VersionUpgradeMotion = 'VersionUpgradeMotion',
  UnlockTokenMotion = 'UnlockTokenMotion',
}

export const motionNameMapping = {
  mintTokens: ColonyMotions.MintTokensMotion,
  makePaymentFundedFromDomain: ColonyMotions.PaymentMotion,
  addDomain: ColonyMotions.CreateDomainMotion,
  editDomain: ColonyMotions.EditDomainMotion,
  editColony: ColonyMotions.ColonyEditMotion,
  setUserRoles: ColonyMotions.SetUserRolesMotion,
  moveFundsBetweenPots: ColonyMotions.MoveFundsMotion,
  upgrade: ColonyMotions.VersionUpgradeMotion,
  unlockToken: ColonyMotions.UnlockTokenMotion,
};
