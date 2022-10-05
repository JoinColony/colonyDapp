import { Recipient } from '~dashboard/ExpenditurePage/Split/types';

export const isRecipientType = (obj: any): obj is Recipient => {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'id') &&
    (Object.prototype.hasOwnProperty.call(obj, 'amount') ||
      Object.prototype.hasOwnProperty.call(obj, 'user') ||
      Object.prototype.hasOwnProperty.call(obj, 'removed'))
  );
};
