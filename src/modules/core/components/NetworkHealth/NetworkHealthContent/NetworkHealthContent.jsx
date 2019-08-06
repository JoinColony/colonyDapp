/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { NetworkHealthItems } from '../types';

import Icon from '~core/Icon';
import Heading from '~core/Heading';
import NetworkHealthIcon from '../NetworkHealthIcon';
import NetworkHealthContentItem from './NetworkHealthContentItem.jsx';

import styles from './NetworkHealthContent.css';

const MSG = defineMessages({
  healthTitle: {
    id: 'core.NetworkHealth.NetworkHealthContent.healthTitle',
    defaultMessage: `Network Health: {health, select,
      3 {good}
      2 {fair}
      1 {poor}
    }`,
  },
  /*
   * @TODO We might want to update this copy
   */
  healthDetails: {
    id: 'core.NetworkHealth.NetworkHealthContent.healthDetails',
    defaultMessage: `The network's health is {health, select,
      3 {good. All systems are operational.}
      2 {fair. You might experience reduced data loading.}
      1 {poor. Your data will probably fail to load.}
      other {unknown. Hold tight until we check it.}
    }`,
  },
});

type Props = {|
  close?: () => void,
  health: number,
  networkItems?: NetworkHealthItems,
|};

const displayName = 'NetworkHealth.NetworkHealthContent';

const NetworkHealthContent = ({ close, health, networkItems = [] }: Props) => (
  <div className={styles.main}>
    <div className={styles.header}>
      <div className={styles.healthDetailsWrapper}>
        <div className={styles.healthTitle}>
          <Heading appearance={{ margin: 'none', size: 'normal' }}>
            <span className={styles.healthIconWrapper}>
              <NetworkHealthIcon health={health} appearance={{ size: 'pea' }} />
            </span>
            <FormattedMessage {...MSG.healthTitle} values={{ health }} />
          </Heading>
        </div>
        <div className={styles.healthDetails}>
          <FormattedMessage {...MSG.healthDetails} values={{ health }} />
        </div>
      </div>
      <div className={styles.actionsContainer}>
        {close && (
          <button className={styles.closeButton} onClick={close} type="button">
            <Icon
              appearance={{ size: 'normal' }}
              name="close"
              title={{ id: 'button.close' }}
            />
          </button>
        )}
      </div>
    </div>
    <ul className={styles.content}>
      {networkItems.map(networkHealthItem => (
        <NetworkHealthContentItem
          networkHealthItem={networkHealthItem}
          // Flow ¯\_(ツ)_/¯
          key={
            typeof networkHealthItem.itemTitle.id == 'string'
              ? networkHealthItem.itemTitle.id
              : networkHealthItem.itemTitle.toString()
          }
        />
      ))}
    </ul>
  </div>
);

NetworkHealthContent.displayName = displayName;

export default NetworkHealthContent;
