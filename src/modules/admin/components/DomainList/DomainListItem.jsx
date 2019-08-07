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
    defaultMessage: `{contributions} Contributions`,
  },
  buttonEdit: {
    id: 'admin.DomainList.DomainListItem.buttonEdit',
    defaultMessage: 'Edit name',
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
   * Method to call when clicking the edit button
   * Gets passed down to `DomainListItem`
   */
  onEdit: (DataType<DomainType>) => any,
|};

const DomainListItem = ({
  domain,
  contributions = 25,
  viewOnly = true,
  onEdit,
}: Props) => (
  <TableRow className={styles.main}>
    <TableCell className={styles.domainDetails}>
      <span className={styles.domainName} title={domain.name}>
        {domain.name}
      </span>
      {!viewOnly && (
        <span
          className={styles.editDomain}
          title={MSG.buttonEdit.defaultMessage}
        >
          <Button
            className={styles.customEditButton}
            appearance={{ theme: 'blue' }}
            text={MSG.buttonEdit}
            onClick={onEdit}
          />
        </span>
      )}
      {contributions && (
        <span className={styles.contributions}>
          <FormattedMessage values={{ contributions }} {...MSG.contributions} />
        </span>
      )}
    </TableCell>
  </TableRow>
);

DomainListItem.displayName = displayName;

export default DomainListItem;
