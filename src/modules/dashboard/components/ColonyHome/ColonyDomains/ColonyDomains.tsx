import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { DomainType } from '~immutable/index';
import Button from '~core/Button';
import Heading from '~core/Heading';
import { useDataFetcher } from '~utils/hooks';
import { domainsFetcher } from '../../../fetchers';
import styles from './ColonyDomains.css';

interface Props {
  colonyAddress: Address;
  filteredDomainId: number;
  setFilteredDomainId: Function;
  noTitle?: boolean;
}

const MSG = defineMessages({
  allDomains: {
    id: 'dashboard.ColonyDomains.allDomains',
    defaultMessage: 'All Domains',
  },
  title: {
    id: 'dashboard.ColonyDomains.title',
    defaultMessage: 'Domains',
  },
});

const getActiveDomainFilterClass = (id = 0, filteredDomainId: number) =>
  filteredDomainId === id ? styles.filterItemActive : styles.filterItem;

const displayName = 'dashboard.ColonyDomains';

const ColonyDomains = ({
  colonyAddress,
  setFilteredDomainId,
  filteredDomainId,
  noTitle,
}: Props) => {
  // eslint-disable-next-line prettier/prettier
  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  return (
    <ul>
      {!noTitle && (
        <Heading
          appearance={{ size: 'normal', weight: 'bold' }}
          text={MSG.title}
        />
      )}
      <li>
        <Button
          className={getActiveDomainFilterClass(0, filteredDomainId)}
          onClick={() => setFilteredDomainId()}
        >
          <FormattedMessage {...MSG.allDomains} />
        </Button>
      </li>
      {(domains || []).map(({ name, id }) => (
        <li key={`domain_${id}`}>
          <Button
            className={getActiveDomainFilterClass(id, filteredDomainId)}
            onClick={() => setFilteredDomainId(id)}
          >
            {name}
          </Button>
        </li>
      ))}
    </ul>
  );
};

ColonyDomains.displayName = displayName;

export default ColonyDomains;
