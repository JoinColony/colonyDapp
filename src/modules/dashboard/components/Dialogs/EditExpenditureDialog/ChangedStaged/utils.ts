import { Milestone } from '~dashboard/ExpenditurePage/Staged/types';

export const isMilestoneType = (obj: any): obj is Milestone => {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'id') &&
    (Object.prototype.hasOwnProperty.call(obj, 'amount') ||
      Object.prototype.hasOwnProperty.call(obj, 'name') ||
      Object.prototype.hasOwnProperty.call(obj, 'removed'))
  );
};
