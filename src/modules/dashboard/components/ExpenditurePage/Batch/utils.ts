export const isBatchPaymentType = (object: any) => {
  if (typeof object !== 'object') {
    return false;
  }
  if ('recipient' in object && 'token' in object && 'amount' in object) {
    return true;
  }
  return false;
};
