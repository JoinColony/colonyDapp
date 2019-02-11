/* @flow */

import type { DataRecordType } from '../Data';
import type { TaskPayoutType, TaskPayoutRecordType } from '../TaskPayout';
import type { TokenType, TokenRecordType } from '../Token';
import type { UserType, UserRecordType } from '../User';

const NETWORK_FEE = 0.01;

export const getTaskPayoutNetworkFee = ({
  amount,
}: TaskPayoutType | TaskPayoutRecordType) => amount * NETWORK_FEE;

export const getTaskPayoutAmountMinusNetworkFee = (
  payout: TaskPayoutType | TaskPayoutRecordType,
) => payout.amount - getTaskPayoutNetworkFee(payout);

export const tokenBalanceIsPositive = ({
  balance,
}: TokenType | TokenRecordType) => balance >= 0;

export const tokenBalanceIsNotPositive = ({
  balance,
}: TokenType | TokenRecordType) => balance <= 0;

export const tokenIsETH = ({ address }: TokenType | TokenRecordType) =>
  address === '0x0';

export const shouldFetchData = (data: ?DataRecordType<*>) =>
  !data || !(data.isFetching || data.error || data.record);

export const userDidClaimProfile = ({
  profile: { username },
}: UserType | UserRecordType) => !!username;
