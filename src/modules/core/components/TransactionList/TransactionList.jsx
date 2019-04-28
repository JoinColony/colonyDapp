/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import TransactionListItem from './TransactionListItem.jsx';

import type { ContractTransactionType } from '~immutable';

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
  transactions: ?Array<ContractTransactionType>,
  isLoading?: boolean,
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
  isLoading = false,
  showMaskedAddress,
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
    {isLoading && <SpinnerLoader />}
    {!isLoading &&
      (transactions && transactions.length ? (
        <Table scrollable>
          <TableBody>
            {transactions.map(transaction => (
              <TransactionListItem
                key={transaction.id}
                linkToEtherscan={linkToEtherscan}
                showMaskedAddress={showMaskedAddress}
                transaction={transaction}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        emptyState || (
          <p>
            <FormattedMessage {...MSG.noTransactions} />
          </p>
        )
      ))}
  </div>
);

TransactionList.displayName = displayName;

export default TransactionList;
