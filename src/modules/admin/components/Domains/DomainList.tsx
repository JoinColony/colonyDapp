import { MessageDescriptor } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import React from 'react';

import { Address, DomainsMapType } from '~types/index';
import { createAddress } from '~utils/web3';

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
}: Props) => {
  const GET_SUBGRAPH_DOMAINS = gql`
    query AllDomains {
    domains {
      id
      name
    }
  }`;
  const { data: subgraphDomainsData } = useQuery(GET_SUBGRAPH_DOMAINS, {
    context: { endpoint: 'subgraph' }
  });
  const subgraphDomains = subgraphDomainsData.domains.filter(({ id, name }) => {
    const extractedColonyAddress = createAddress(id.replace(/_\d/, ''));
    return extractedColonyAddress === colonyAddress;
  });

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
                  domain={{
                    id,
                    name,
                  }}
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
