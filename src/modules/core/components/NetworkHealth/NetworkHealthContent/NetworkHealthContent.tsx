import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { NetworkHealthItems } from '../types';

import Icon from '~core/Icon';
import Heading from '~core/Heading';
import ExpandedParagraph from '~core/ExpandedParagraph';
import NetworkHealthIcon from '../NetworkHealthIcon';
import NetworkHealthContentItem from './NetworkHealthContentItem';

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
    defaultMessage: `{health, select,
      3 {{networkBusy, select,
        false {The network's health is good. All systems are operational.}
        true {Data is currently saving but the network health is good. This
          should only take a couple of seconds.}
      }}
      2 {The network's health is fair. You might experience reduced data
        loading.}
      1 {{networkBusy, select,
        false {The network's health is poor.}
        true {Data is currently trying to save, but the network health is poor.}
      } Please keep your browser open until the network health improves.}
    }`,
  },
  expandSectionLabel: {
    id: 'core.NetworkHealth.NetworkHealthContent.expandSectionLabel',
    defaultMessage: 'Advanced',
  },
});

interface Props {
  close?: () => void;
  health: number;
  networkItems?: NetworkHealthItems;
  networkBusy?: boolean;
}

const displayName = 'NetworkHealth.NetworkHealthContent';

const NetworkHealthContent = ({
  close,
  health,
  networkItems = [],
  /*
   * @NOTE Erring on the side of caution here:
   * If we (for some reason) can't get the busy state, assume it's busy
   */
  networkBusy = true,
}: Props) => {
  const renderNetworkItems = (
    <ul className={styles.content}>
      {networkItems.map(networkHealthItem => (
        <NetworkHealthContentItem
          networkHealthItem={networkHealthItem}
          key={
            typeof networkHealthItem.itemTitle.id == 'string'
              ? networkHealthItem.itemTitle.id
              : networkHealthItem.itemTitle.toString()
          }
        />
      ))}
    </ul>
  );
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.healthDetailsWrapper}>
          <div className={styles.healthTitle}>
            <Heading appearance={{ margin: 'none', size: 'normal' }}>
              <span className={styles.healthIconWrapper}>
                <NetworkHealthIcon
                  health={health}
                  appearance={{ size: 'pea' }}
                />
              </span>
              <FormattedMessage {...MSG.healthTitle} values={{ health }} />
            </Heading>
          </div>
          <div className={styles.healthDetails}>
            <FormattedMessage
              {...MSG.healthDetails}
              values={{
                health,
                networkBusy,
              }}
            />
          </div>
        </div>
        <div className={styles.actionsContainer}>
          {close && (
            <button
              className={styles.closeButton}
              onClick={close}
              type="button"
            >
              <Icon
                appearance={{ size: 'normal' }}
                name="close"
                title={{ id: 'button.close' }}
              />
            </button>
          )}
        </div>
      </div>
      <section className={styles.expandedSectionContainer}>
        <ExpandedParagraph
          characterLimit={0}
          maximumCharacters={0}
          paragraph=""
          expandedElements={renderNetworkItems}
          expandText={MSG.expandSectionLabel}
        />
      </section>
    </div>
  );
};

NetworkHealthContent.displayName = displayName;

export default NetworkHealthContent;
