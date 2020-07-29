export enum PurchaseStatus {
  Failure = 'failure', // Error purchasing *any* - i.e. tx error
  PartialSuccess = 'partialSuccess', // Purchased remaining supply (less than intended)
  Pending = 'pending',
  Success = 'success',
  SuccessNetZero = 'successNetZero', // Tx was successful, but supply sold-out
}
