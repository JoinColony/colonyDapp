export const isBatchPaymentType = (object: any) => {
  if (typeof object !== 'object') {
    return false;
  }
  if ('recipient' in object && 'token' in object && 'amount' in object) {
    return true;
  }
  return false;
};

export const checkValidMessageObject = (errorMessage) => {
  return (
    errorMessage && typeof errorMessage === 'object' && 'id' in errorMessage
  );
};
