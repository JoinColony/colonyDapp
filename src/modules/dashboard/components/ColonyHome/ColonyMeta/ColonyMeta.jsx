/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import ColonyAvatar from '~core/ColonyAvatar';

import styles from './ColonyMeta.css';

import type { ColonyType } from '../../../types';

const MSG = defineMessages({
  websiteLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.websiteLabel',
    defaultMessage: 'Website',
  },
  guidelineLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.guidelineLabel',
    defaultMessage: 'Contribute Guidelines',
  },
});

const componentDisplayName: string = 'dashboard.ColonyHome.ColonyMeta';

type Props = {
  colony: ColonyType,
};

const ColonyMeta = ({
  colony: { avatar, name, address, description, website, guideline },
}: Props) => (
  <div className={styles.main}>
    <ColonyAvatar
      className={styles.avatar}
      avatarURL={avatar}
      colonyAddress={address}
      colonyName={name}
      size="xl"
    />
    <Heading
      appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
      text={name}
    />
    {description && (
      <section className={styles.description}>
        <p>{description}</p>
      </section>
    )}
    {website && (
      <section className={styles.website}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.websiteLabel}
        />
        <a href={website} rel="noopener noreferrer" target="_blank">
          {website}
        </a>
      </section>
    )}
    {guideline && (
      <section className={styles.website}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.guidelineLabel}
        />
        <a href={guideline} rel="noopener noreferrer" target="_blank">
          {guideline}
        </a>
      </section>
    )}
  </div>
);

ColonyMeta.displayName = componentDisplayName;

export default ColonyMeta;
