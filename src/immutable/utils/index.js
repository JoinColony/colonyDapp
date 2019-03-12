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

/*
 * Given a data record and an optional TTL value, determine whether
 * the data should be fetched.
 *
 * The data should be fetched if:
 * 1. it is falsy
 * 2. it is not fetching or loaded
 * 3. its `lastFetchedAt` property indicates it should be refreshed
 */
export const shouldFetchData = (
  data: ?DataRecordType<*>,
  ttl: number,
  isFirstMount: boolean,
): boolean => {
  // This could be simpler, but for the sake of readability let's spell it out.
  if (data == null) return true;
  if (data.isFetching) return false;
  if (data.error && isFirstMount) return true;

  return !!(
    ttl &&
    data.lastFetchedAt > 0 &&
    Date.now() - data.lastFetchedAt > ttl
  );
};

export const isFetchingData = (data: ?DataRecordType<*>) =>
  !data || data.isFetching;

export const userDidClaimProfile = ({
  profile: { username },
}: UserType | UserRecordType) => !!username;
