export enum ExpenditureActions {
  Staked = 'Staked',
  CreatingDraft = 'CreatingDraft',
  CancelingDraft = 'CancelingDraft',
  ReclaimedTheStake = 'ReclaimedTheStake',
  LockingTheExpenditure = 'LockingTheExpenditure',
  ChangingTheExpenditure = 'ChangingTheExpenditure',
  CreatingAMotion = 'CreatingAMotion',
  ChangingOwner = 'ChangingOwner',
  CreatingMotionToChangingOwner = 'CreatingMotionToChangingOwner',
  AddingFounds = 'AddingFounds',
  EndingTheExpenditure = 'EndingTheExpenditure',
  RealisingTheFounds = 'RealisingTheFounds',
  Founded = 'Founded',
  ClaimingFounds = 'ClaimingFounds',
  ClaimedFounds = 'ClaimedFounds',
  /*
   * Expenditure changes
   */
  Recipient = 'Recipient',
  Value = 'Value',
  ClaimDelay = 'ClaimDelay',
}
