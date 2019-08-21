/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DomainType } from '~immutable/index';
import { Address } from '~types/index';

import { ActionTypes } from '~redux/index';
import { TableRow, TableCell } from '~core/Table';
import { DialogActionButton } from '~core/Button';

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

interface Props {
  contributions?: number;
  /*
   * Domain data object, follows the same format as UserPicker
   */
  domain: DomainType;
  viewOnly: boolean;
  colonyAddress: Address;
}

const DomainListItem = ({
  contributions,
  domain,
  viewOnly = true,
  colonyAddress,
}: Props) => (
  <TableRow className={styles.main}>
    <TableCell className={styles.domainDetails}>
      <span className={styles.domainName} title={domain.name}>
        {domain.name}
      </span>
      {!viewOnly && (
        <span title={MSG.buttonEdit.defaultMessage}>
          <DialogActionButton
            dialog="DomainEditDialog"
            dialogProps={{
              domain,
              colonyAddress,
            }}
            className={styles.customEditButton}
            appearance={{ theme: 'blue' }}
            text={MSG.buttonEdit}
            submit={ActionTypes.DOMAIN_EDIT}
            success={ActionTypes.DOMAIN_EDIT_SUCCESS}
            error={ActionTypes.DOMAIN_EDIT_ERROR}
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
