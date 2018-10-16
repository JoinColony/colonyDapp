/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import DomainListItem from './DomainListItem.jsx';

import styles from './DomainList.css';

import type { MessageDescriptor } from 'react-intl';
import type { UserData } from '~core/SingleUserPicker';

type DomainData = {
  domainName: string,
  contributions: number,
};

type Props = {
  /*
   * Array of user data, follows the same format as UserPicker
   */
  domains: Array<DomainData>,
  /*
   * Whether to show the remove button
   * Gets passed down to `DomainListItem`
   */
  viewOnly?: boolean,
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor,
  /*
   * Method to call when removing the user
   * Gets passed down to `DomainListItem`
   */
  onRemove: UserData => any,
};

const displayName: string = 'admin.DomainList';

const DomainList = ({ domains, viewOnly = true, label, onRemove }: Props) => (
  <div className={styles.main}>
    {label && (
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={label}
      />
    )}
    <div className={styles.listWrapper}>
      <Table scrollable>
        <TableBody>
          {domains.map((domain, currentIndex) => (
            <DomainListItem
              key={`${domain.domainName}${currentIndex + 1}`}
              domain={domain}
              viewOnly={viewOnly}
              onRemove={() => onRemove(domain)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

DomainList.displayName = displayName;

export default DomainList;
