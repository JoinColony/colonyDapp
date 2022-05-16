import React from 'react';
import classNames from 'classnames';

import CLNYIcon from '../../../../../img/tokens/CLNY.svg';
import EtherIcon from '../../../../../img/tokens/ether.svg';
import styles from './TopParameters.css';

export const balanceData = [
  {
    label: '25,000 CLNY',
    value: '25,000 CLNY',
    children: (
      <div
        className={classNames(styles.label, styles.option, styles.firstOption)}
      >
        <span className={styles.icon}>
          <CLNYIcon />
        </span>
        <span>25,000 CLNY</span>
      </div>
    ),
  },
  {
    label: '15,000 ETH',
    value: '15,000 ETH',
    children: (
      <div className={classNames(styles.label, styles.option)}>
        <span className={styles.icon}>
          <EtherIcon />
        </span>
        <span>15,000 ETH</span>
      </div>
    ),
  },
];

export const domains = [
  {
    color: 0,
    description: null,
    ethDomainId: 1,
    ethParentDomainId: null,
    id: '0xeabe562c979679dc4023dd23e8c6aa782448c2e7_domain_1',
    name: 'Root',
    colonyAddress: '0xEaBE562C979679DC4023dD23e8C6aa782448c2E7',
    withoutPadding: true,
  },
  {
    color: 1,
    description: null,
    ethDomainId: 2,
    ethParentDomainId: 1,
    id: '0xeabe562c979679dc4023dd23e8c6aa782448c2e7_domain_2',
    name: 'Dev',
    colonyAddress: '0xEaBE562C979679DC4023dD23e8C6aa782448c2E7',
    withoutPadding: true,
  },
];

export const colonyAddress = '0xEaBE562C979679DC4023dD23e8C6aa782448c2E7';
