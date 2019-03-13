/* @flow */

import type { TaskPayoutType, TaskPayoutRecordType } from '../TaskPayout';

const NETWORK_FEE = 0.01;

// TODO consider moving these to selectors (when we're clear on the task payout state)
export const getTaskPayoutNetworkFee = ({
  amount,
}: TaskPayoutType | TaskPayoutRecordType) => amount * NETWORK_FEE;

export const getTaskPayoutAmountMinusNetworkFee = (
  payout: TaskPayoutType | TaskPayoutRecordType,
) => payout.amount - getTaskPayoutNetworkFee(payout);
