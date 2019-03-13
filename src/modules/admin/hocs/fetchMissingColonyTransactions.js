/* @flow */

import type { List as ListType } from 'immutable';

import { branch, lifecycle } from 'recompose';

import { shouldFetchData } from '~immutable/utils';

import type { ContractTransactionRecordType, DataRecordType } from '~immutable';
import type { ENSName } from '~types';

type TransactionsData = ?DataRecordType<
  ListType<ContractTransactionRecordType>,
>;

const shouldFetchColonyTransactions = ({
  transactions,
  ensName,
}: {
  transactions: TransactionsData,
  ensName: ENSName,
}) => !!(ensName && shouldFetchData(transactions, 0, false));

const shouldFetchColonyUnclaimedTransactions = ({
  unclaimedTransactions,
  ensName,
}: {
  unclaimedTransactions: TransactionsData,
  ensName: ENSName,
}) => !!(ensName && shouldFetchData(unclaimedTransactions, 0, false));

const fetchMissingColonyTransactions = branch(
  props =>
    shouldFetchColonyTransactions(props) ||
    shouldFetchColonyUnclaimedTransactions(props),
  lifecycle({
    componentDidMount() {
      const {
        ensName,
        fetchColonyTransactions,
        fetchColonyUnclaimedTransactions,
      } = this.props;
      if (shouldFetchColonyTransactions(this.props))
        fetchColonyTransactions(ensName);
      if (shouldFetchColonyUnclaimedTransactions(this.props))
        fetchColonyUnclaimedTransactions(ensName);
    },
  }),
);

export default fetchMissingColonyTransactions;
