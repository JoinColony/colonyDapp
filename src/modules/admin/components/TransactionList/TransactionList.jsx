/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import TransactionListItem from './TransactionListItem.jsx';

import styles from './TransactionList.css';

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
   *
   */
  onClaim?: Object => any,
};

const displayName: string = 'admin.TransactionList';

const TransactionList = ({
  label,
  transactions,
  currentColonyAddress,
  showMaskedAddress,
  onClaim,
}: Props) => (
  <div className={styles.main}>
    {label && (
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={label}
      />
    )}
    <div className={styles.listWrapper}>
      {transactions &&
        transactions.length && (
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
                />
              ))}
            </TableBody>
          </Table>
        )}
    </div>
  </div>
);

TransactionList.displayName = displayName;

export default TransactionList;
