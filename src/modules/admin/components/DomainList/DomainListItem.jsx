/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { DataType, DomainType } from '~immutable';

import { TableRow, TableCell } from '~core/Table';
import Button from '~core/Button';

import styles from './DomainListItem.css';

const MSG = defineMessages({
  buttonRemove: {
    id: 'admin.DomainList.DomainListItem.buttonRemove',
    defaultMessage: 'Remove',
  },
  contributions: {
    id: 'admin.DomainList.DomainListItem.contributions',
    defaultMessage: `Contributions: {contributions}`,
  },
});

const displayName = 'admin.DomainList.DomainListItem';

type Props = {|
  contributions?: number,
  /*
   * Domain data object, follows the same format as UserPicker
   */
  domain: DomainType,
  viewOnly: boolean,
  /*
   * Method to call when clicking the remove button
   * Gets passed down to `DomainListItem`
   */
  onRemove: (DataType<DomainType>) => any,
|};

const DomainListItem = ({
  domain,
  contributions,
  viewOnly = true,
  onRemove,
}: Props) => (
  <TableRow className={styles.main}>
    <TableCell className={styles.domainDetails}>
      <span className={styles.domainName} title={domain.name}>
        #{domain.name}
      </span>
      {contributions && (
        <span className={styles.contributions}>
          <FormattedMessage values={{ contributions }} {...MSG.contributions} />
        </span>
      )}
    </TableCell>
    {!viewOnly && (
      <TableCell className={styles.userRemove}>
        <Button
          className={styles.customRemoveButton}
          appearance={{ theme: 'primary' }}
          text={MSG.buttonRemove}
          onClick={onRemove}
        />
      </TableCell>
    )}
  </TableRow>
);

DomainListItem.displayName = displayName;

export default DomainListItem;
