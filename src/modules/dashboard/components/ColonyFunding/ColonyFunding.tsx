import React from 'react';
import { RouteChildrenProps } from 'react-router';

import Tokens from '~admin/Tokens';
import { useColonyFromNameQuery } from '~data/index';

import styles from './ColonyFunding.css';

type Props = RouteChildrenProps<{ colonyName: string }>;

const componentDisplayName = 'dashboard.ColonyFunding';

const ColonyFunding = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${componentDisplayName} Please check route setup.`,
    );
  }
  const { colonyName } = match.params;

  const { data } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  if (!data) {
    return null;
  }

  const { colony } = data;

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Tokens colony={colony} />
      </div>
    </div>
  );
};

ColonyFunding.displayName = componentDisplayName;

export default ColonyFunding;
