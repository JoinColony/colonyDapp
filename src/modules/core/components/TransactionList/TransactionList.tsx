import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';
import TransactionListItem from './TransactionListItem';
import { ContractTransactionType } from '~immutable/index';

interface Props {
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor;
  transactions: ContractTransactionType[] | void;
  isLoading?: boolean;

  /*
   * The user's address will always be shown, this just controls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean;

  /*
   * Whether to show the button to link to etherscan (or not)
   */
  linkToEtherscan?: boolean;
  emptyState?: ReactNode;
}

const displayName = 'admin.TransactionList';

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
                key={transaction.hash}
                linkToEtherscan={linkToEtherscan}
                showMaskedAddress={showMaskedAddress}
                transaction={transaction}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        emptyState || null
      ))}
  </div>
);

TransactionList.displayName = displayName;

export default TransactionList;
