/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

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

type DomainData = {
  domainName: string,
  contributions: number,
};

type Props = {
  /*
   * Domain data object
   */
  domain: DomainData,
  viewOnly: boolean,
  /*
   * Method to call when clicking the remove button
   * Gets passed down to `DomainListItem`
   */
  onRemove: DomainData => any,
};

const DomainListItem = ({
  domain: { domainName = '', contributions = 0 },
  viewOnly = true,
  onRemove,
}: Props) => (
  <TableRow className={styles.main}>
    <TableCell className={styles.domainDetails}>
      <span className={styles.domainName} title={domainName}>
        #{domainName}
      </span>
      <span className={styles.contributions}>
        <FormattedMessage values={{ contributions }} {...MSG.contributions} />
      </span>
    </TableCell>
    <TableCell className={styles.domainRemove}>
      {!viewOnly && (
        <Button
          className={styles.customRemoveButton}
          appearance={{ theme: 'primary' }}
          text={MSG.buttonRemove}
          onClick={onRemove}
        />
      )}
    </TableCell>
  </TableRow>
);

DomainListItem.displayName = displayName;

export default DomainListItem;
