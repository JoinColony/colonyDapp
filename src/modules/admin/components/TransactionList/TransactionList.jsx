/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import TransactionListItem from './TransactionListItem.jsx';

import type { MessageDescriptor } from 'react-intl';
import type { TransactionType } from '~types/transaction';

type Props = {
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor,
  /*
   *
   */
  transactions: Array<TransactionType>,
  /*
   * The current conlony's address.
   */
  currentColonyAddress: string,
  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean,
  /*
   * Method to call when clicking the 'Claim' button
   * Only by setting this method, will the actual button show up
   */
  onClaim?: TransactionType => any,
  /*
   * Method to call when clicking the 'Etherscan' button
   * This should. in theory redirect you to etherscan, but it can be customized
   *
   * @NOTE that if this set that onClaim will not have any effect since
   * the *Clain* button won't show up anymore
   */
  onEtherscan?: TransactionType => any,
};

const displayName: string = 'admin.TransactionList';

const TransactionList = ({
  label,
  transactions,
  currentColonyAddress,
  showMaskedAddress,
  onClaim,
  onEtherscan,
}: Props) => (
  <div>
    {label && (
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={label}
      />
    )}
    {transactions &&
      /*
       * Needs to be typecast, otherwise React will just print the value (eg: 0)
       */
      !!transactions.length && (
        <Table scrollable>
          <TableBody>
            {transactions.map((transaction: TransactionType) => (
              <TransactionListItem
                key={transaction.nonce}
                transaction={transaction}
                showMaskedAddress={showMaskedAddress}
                incoming={transaction.to === currentColonyAddress}
                /*
                 * Only pass down the onClaim prop if one was provided
                 */
                {...(typeof onClaim === 'function'
                  ? {
                      onClaim: () => onClaim(transaction),
                    }
                  : {})}
                /*
                 * Only pass down the onEtherscan prop if one was provided
                 */
                {...(typeof onEtherscan === 'function'
                  ? {
                      onEtherscan: () => onEtherscan(transaction),
                    }
                  : {})}
              />
            ))}
          </TableBody>
        </Table>
      )}
  </div>
);

TransactionList.displayName = displayName;

export default TransactionList;
