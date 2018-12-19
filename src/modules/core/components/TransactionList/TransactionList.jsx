/* @flow */

import React from 'react';

import type { List } from 'immutable';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import TransactionListItem from './TransactionListItem.jsx';

import type { MessageDescriptor } from 'react-intl';
import type { ContractTransactionRecord } from '~immutable';

type Props = {
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor,
  /*
   *
   */
  transactions: List<ContractTransactionRecord>,
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
  onClaim?: ContractTransactionRecord => any,
  /*
   * If to show the button to link to etherscan (or not)
   *
   * @NOTE that if this set that onClaim will not have any effect since
   * the *Claim* button won't show up anymore
   */
  linkToEtherscan?: boolean,
};

const displayName: string = 'admin.TransactionList';

const TransactionList = ({
  label,
  transactions,
  showMaskedAddress,
  onClaim,
  linkToEtherscan = true,
}: Props) => (
  <div>
    {transactions && transactions.size ? (
      <div>
        {label && (
          <Heading
            appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
            text={label}
          />
        )}
        <Table scrollable>
          <TableBody>
            {transactions.map(transaction => (
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
      </div>
    ) : null}
  </div>
);

TransactionList.displayName = displayName;

export default TransactionList;
