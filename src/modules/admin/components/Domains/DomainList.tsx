import { MessageDescriptor } from 'react-intl';

import React from 'react';

import { Address, DomainsMapType } from '~types/index';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import DomainListItem from './DomainListItem';

import styles from './DomainList.css';

interface Props {
  /*
   * Map of domain data
   */
  domains?: DomainsMapType;
  /*
   * Whether to show the remove button
   * Gets passed down to `DomainListItem`
   */
  viewOnly?: boolean;
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor;
  colonyAddress: Address;
}

const displayName = 'admin.DomainList';

const DomainList = ({
  domains,
  viewOnly = true,
  label,
  colonyAddress,
}: Props) => (
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
          {domains && (
            Object.keys(domains).map(domainId => (
              <DomainListItem
                key={domainId}
                domain={domains[domainId]}
                viewOnly={viewOnly}
                colonyAddress={colonyAddress}
              />
            )))}
        </TableBody>
      </Table>
    </div>
  </div>
);

DomainList.displayName = displayName;

export default DomainList;
