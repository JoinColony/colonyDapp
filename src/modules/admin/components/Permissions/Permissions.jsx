/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { Address } from '~types';

import Heading from '~core/Heading';

import styles from './Permissions.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Permissions.title',
    defaultMessage: 'Permissions',
  },
});

type Props = {|
  colonyAddress: Address,
|};

const displayName = 'admin.Permissions';

// eslint-disable-next-line no-unused-vars
const Permissions = ({ colonyAddress }: Props) => (
  <div className={styles.main}>
    <main>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
      </div>
      <p>Placeholder for main</p>
    </main>
    <aside className={styles.sidebar}>
      <ul>
        <li>
          <p>Placeholder for sidebar</p>
        </li>
      </ul>
    </aside>
  </div>
);

Permissions.displayName = displayName;

export default Permissions;
