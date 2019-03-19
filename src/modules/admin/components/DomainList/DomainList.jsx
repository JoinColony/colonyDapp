/* @flow */
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import nanoid from 'nanoid';

import type { DomainType } from '~immutable';

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
  /*
   * Method to call when removing the domain
   * Gets passed down to `DomainListItem`
   */
  onRemove: DomainType => any,
|};

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
          {domains ? (
            domains.map((domain, currentIndex) => (
              <DomainListItem
                key={nanoid(currentIndex)}
                domain={domain}
                viewOnly={viewOnly}
                onRemove={() => onRemove(domain)}
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
