/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import Heading from '~core/Heading';
import NetworkHealthIcon from '../NetworkHealthIcon';

import styles from './NetworkHealthContent.css';

const MSG = defineMessages({
  /*
   * Shown by the default Browser title on hover
   */
  healthTitle: {
    id: 'core.NetworkHealth.NetworkHealthContent.healthTitle',
    defaultMessage: 'Network Health: {health}',
  },
  /*
   * @TODO We might want to update this copy
   */
  healthDetails: {
    id: 'core.NetworkHealth.NetworkHealthContent.healthDetails',
    defaultMessage: `The network's health is {health, select,
      good {good. All systems are operational.}
      mean {average. You might experience reduced data loading.}
      critical {critical. Your data will probably fail to load.}
      other {unknown. Hold tight until we check it.}
    }`,
  },
});

type Props = {|
  close?: () => void,
  health: 'good' | 'mean' | 'critical',
|};

const displayName = 'NetworkHealth.NetworkHealthContent';

const NetworkHealthContent = ({ close, health }: Props) => (
  <div className={styles.main}>
    <div className={styles.header}>
      <div className={styles.healthDetailsWrapper}>
        <div className={styles.healthTitle}>
          <Heading appearance={{ margin: 'none', size: 'normal' }}>
            <span className={styles.healthIconWrapper}>
              <NetworkHealthIcon
                health={health}
                appearance={{ size: 'tiny' }}
              />
            </span>
            <FormattedMessage
              {...MSG.healthTitle}
              values={{
                health: health.charAt(0).toUpperCase() + health.slice(1),
              }}
            />
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
  </div>
);

NetworkHealthContent.displayName = displayName;

export default NetworkHealthContent;
