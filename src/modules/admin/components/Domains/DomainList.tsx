import React, { useMemo } from 'react';
import { MessageDescriptor } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';


import { Address, DomainsMapType } from '~types/index';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import { filterSgDomains } from '../../transformers';

import DomainListItem from './DomainListItem';

import styles from './DomainList.css';

const GET_SUBGRAPH_DOMAINS = gql`
  query AllDomains {
    domains {
      id
      name
    }
  }
`;

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
  label,
  colonyAddress,
}: Props) => {
  const { data: subgraphDomainsData } = useQuery(GET_SUBGRAPH_DOMAINS, {
    /**
     * Tell the apollo client to use the subgraph endpoint link
    */
    context: { endpoint: 'subgraph' },
    /**
     * Fake having this in real time
    */
    pollInterval: 500,
  });
  const subgraphDomains = useMemo(
    () => {
      if (subgraphDomainsData && subgraphDomainsData.domains) {
        return filterSgDomains(subgraphDomainsData.domains, colonyAddress);
      }
      return [];
    },
    [filterSgDomains, colonyAddress, subgraphDomainsData],
  );
  return (
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
            {subgraphDomains ? (
              subgraphDomains.map(({ id, name }) => (
                <DomainListItem
                  key={id}
                  domain={{ id, name }}
                  viewOnly
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
};

DomainList.displayName = displayName;

export default DomainList;
