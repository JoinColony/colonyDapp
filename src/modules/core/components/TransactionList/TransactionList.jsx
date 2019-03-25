/* @flow */

import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import TransactionListItem from './TransactionListItem';

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';
import type { ContractTransactionType, DataType } from '~immutable';

const MSG = defineMessages({
  noTransactions: {
    id: 'admin.TransactionList.noTransactions',
    defaultMessage: 'No transactions',
  },
});

type Props = {|
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor,
  /*
   *
   */
  transactions: ?DataType<Array<ContractTransactionType>>,
  /*
   * The user's address will always be shown, this just controls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean,
  /*
   * Method to call when clicking the 'Claim' button
   * Only by setting this method, will the actual button show up
   */
  onClaim?: ContractTransactionType => any,
  /*
   * If to show the button to link to etherscan (or not)
   *
   * @NOTE that if this set that onClaim will not have any effect since
   * the *Claim* button won't show up anymore
   */
  linkToEtherscan?: boolean,
  emptyState?: Node,
|};

const displayName: string = 'admin.TransactionList';

const TransactionList = ({
  label,
  transactions,
  showMaskedAddress,
  onClaim,
  linkToEtherscan = true,
  emptyState,
}: Props) => (
  <div>
    {label && (
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={label}
      />
    )}
    {transactions && transactions.record && !!transactions.record.length && (
      <Table scrollable>
        <TableBody>
          {transactions.record.map(transaction => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              showMaskedAddress={showMaskedAddress}
              incoming={transaction.incoming}
              onClaim={onClaim}
              linkToEtherscan={linkToEtherscan}
            />
          ))}
        </TableBody>
      </Table>
    )}
    {transactions &&
      transactions.record &&
      !transactions.record.length &&
      (emptyState || (
        <p>
          <FormattedMessage {...MSG.noTransactions} />
        </p>
      ))}
    {transactions && transactions.isFetching && <SpinnerLoader />}
  </div>
);

TransactionList.displayName = displayName;

export default TransactionList;
