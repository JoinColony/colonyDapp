/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import type { Address } from '~types';

import Heading from '~core/Heading';
import Link from '~core/Link';

import ColonyGridItem from './ColonyGridItem.jsx';

import { CREATE_COLONY_ROUTE } from '~routes';

import styles from './ColonyGrid.css';

const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
  emptyText: {
    id: 'dashboard.Dashboard.TabMyColonies.emptyText',
    // eslint-disable-next-line max-len
    defaultMessage: `It looks like you don't have any colonies. You’ll need an invite link to join a colony. Ask your community for a link or {link}.`,
  },
  createColonyLink: {
    id: 'dashboard.Dashboard.TabMyColonies.createColonyLink',
    defaultMessage: `create a new colony`,
  },
});

type Props = {|
  /** List of Colony addresses */
  colonyAddresses?: Address[],
  emptyStateDescription?: MessageDescriptor,
  /** Object is added as a type, since MessageValues apparently don't include React Elements */
  emptyStateDescriptionValues?: Object,
|};

const displayName = 'ColonyGrid';

const ColonyGrid = ({
  colonyAddresses = [],
  emptyStateDescription = MSG.emptyText,
  emptyStateDescriptionValues = {
    link: (
      <Link
        to={CREATE_COLONY_ROUTE}
        text={MSG.createColonyLink}
        className={styles.createColonyLink}
      />
    ),
  },
}: Props) => (
  <>
    {colonyAddresses.length === 0 ? (
      <Fragment>
        <p className={styles.emptyText}>
          <FormattedMessage
            {...emptyStateDescription}
            values={emptyStateDescriptionValues}
          />
        </p>
      </Fragment>
    ) : (
      <div className={styles.main}>
        <div className={styles.sectionTitle}>
          <Heading text={MSG.title} appearance={{ size: 'medium' }} />
        </div>
        <div className={styles.colonyGrid}>
          {colonyAddresses.map(colonyAddress => (
            <ColonyGridItem colonyAddress={colonyAddress} key={colonyAddress} />
          ))}
        </div>
      </div>
    )}
  </>
);

ColonyGrid.displayName = displayName;

export default ColonyGrid;
