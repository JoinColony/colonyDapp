import React from 'react';

import styles from './BreadCrumb.css';

import { Address } from '~types/index';
import { useDataFetcher } from '~utils/hooks';
import { domainsFetcher } from '../../../dashboard/fetchers';

interface Props {
  colonyAddress: Address;
  filteredDomainId: number;
}

const BreadCrumb = ({ colonyAddress, filteredDomainId }: Props) => {
  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const crumbs = (domains || [])
    .sort((a, b) => a.id - b.id)
    .reduce(
      (accumulator, element) => {
        if (element.id <= filteredDomainId) {
          accumulator.push(element.name);
        }
        return accumulator;
      },
      ['Root'],
    );

  return (
    <div className={styles.crumbContainer}>
      {crumbs.map((crumb, i) => (
        <>
          {crumbs.length > 1 && i < crumbs.length - 1 ? (
            <>
              <p className={styles.breadCrumble}>{crumb}</p>
              <p className={styles.arrow}>&gt;</p>
            </>
          ) : null}
          <>
            {i === crumbs.length - 1 || crumbs.length === 1 ? (
              <>
                <b className={styles.breadCrumble}>{crumb}</b>
              </>
            ) : null}
          </>
        </>
      ))}
    </div>
  );
};

export default BreadCrumb;
