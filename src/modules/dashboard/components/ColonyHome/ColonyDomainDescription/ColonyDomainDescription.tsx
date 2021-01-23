import React from 'react';

import ColorTag from '~core/ColorTag';

import { Colony } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import styles from './ColonyDomainDescription.css';

interface Props {
  colony: Colony;
  currentDomainId: number;
}

const displayName = 'dashboard.ColonyHome.ColonyDomainDescription';

const ColonyDomainDescription = ({ colony, currentDomainId }: Props) => {
  if (currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    return null;
  }
  const { name, color, description } =
    colony.domains.find(({ ethDomainId }) => ethDomainId === currentDomainId) ||
    {};
  return (
    <div className={styles.main}>
      <div className={styles.name}>
        <ColorTag color={color || 0} />
        <span>{name}</span>
      </div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

ColonyDomainDescription.displayName = displayName;

export default ColonyDomainDescription;
