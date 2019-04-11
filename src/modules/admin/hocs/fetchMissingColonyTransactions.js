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
  colonyName,
}: {
  transactions: TransactionsData,
  colonyName: ENSName,
}) => !!(colonyName && shouldFetchData(transactions, 0, false));

const shouldFetchColonyUnclaimedTransactions = ({
  unclaimedTransactions,
  colonyName,
}: {
  unclaimedTransactions: TransactionsData,
  colonyName: ENSName,
}) => !!(colonyName && shouldFetchData(unclaimedTransactions, 0, false));

const fetchMissingColonyTransactions = branch(
  props =>
    shouldFetchColonyTransactions(props) ||
    shouldFetchColonyUnclaimedTransactions(props),
  lifecycle({
    componentDidMount() {
      const {
        colonyName,
        fetchColonyTransactions,
        fetchColonyUnclaimedTransactions,
      } = this.props;
      if (shouldFetchColonyTransactions(this.props))
        fetchColonyTransactions(colonyName);
      if (shouldFetchColonyUnclaimedTransactions(this.props))
        fetchColonyUnclaimedTransactions(colonyName);
    },
  }),
);

export default fetchMissingColonyTransactions;
