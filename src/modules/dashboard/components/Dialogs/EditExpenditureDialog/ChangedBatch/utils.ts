import { Batch } from '~dashboard/ExpenditurePage/Batch/types';

export const isBatchType = (obj: any): obj is Batch => {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'recipients') ||
    Object.prototype.hasOwnProperty.call(obj, 'value')
  );
};

export const isBatchValueType = (arr: any): arr is Batch['value'] => {
  if (!Array.isArray(arr)) {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(arr[0], 'token') &&
    Object.prototype.hasOwnProperty.call(arr[0], 'value')
  );
};
