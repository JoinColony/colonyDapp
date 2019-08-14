/* @flow */
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import nanoid from 'nanoid';

import type { DomainType } from '~immutable';
import type { Address } from '~types';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import DomainListItem from './DomainListItem.jsx';

import styles from './DomainList.css';

type Props = {|
  /*
   * Array of domain data
   */
  domains?: Array<DomainType>,
  /*
   * Whether to show the remove button
   * Gets passed down to `DomainListItem`
   */
  viewOnly?: boolean,
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor,
  colonyAddress: Address,
|};

const displayName: string = 'admin.DomainList';

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
          {domains ? (
            domains.map((domain, currentIndex) => (
              <DomainListItem
                key={nanoid(currentIndex)}
                domain={domain}
                viewOnly={viewOnly}
                colonyAddress={colonyAddress}
              />
            ))
          ) : (
            <div>
              {/* //TODO: Add empty state here once we have it designed */}
            </div>
          )}
        </TableBody>
      </Table>
    </div>
  </div>
);

DomainList.displayName = displayName;

export default DomainList;
