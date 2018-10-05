/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { stripProtocol } from '~utils/strings';

import Heading from '~core/Heading';
import ColonyAvatar from '~core/ColonyAvatar';
import ColonyMetaUserAvatar from './ColonyMetaUserAvatar.jsx';

import styles from './ColonyMeta.css';

import type { ColonyType } from '../../../types';
import type { UserType } from '../../../../users/types';

const MSG = defineMessages({
  websiteLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.websiteLabel',
    defaultMessage: 'Website',
  },
  guidelineLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.guidelineLabel',
    defaultMessage: 'Contribute Guidelines',
  },
  owenersLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.owenersLabel',
    defaultMessage: 'Colony Owners',
  },
  adminsLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.adminsLabel',
    defaultMessage: 'Colony Admins',
  },
});

const displayName: string = 'dashboard.ColonyHome.ColonyMeta';

type Props = {
  colony: ColonyType,
  owners: Array<UserType>,
  admins: Array<UserType>,
};

const ColonyMeta = ({
  colony: { avatar, name, address, description, website, guideline },
  owners,
  admins,
}: Props) => (
  <div>
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
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.websiteLabel}
        />
        <a href={website} rel="noopener noreferrer" target="_blank">
          {stripProtocol(website)}
        </a>
      </section>
    )}
    {guideline && (
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.guidelineLabel}
        />
        <a href={guideline} rel="noopener noreferrer" target="_blank">
          {stripProtocol(guideline)}
        </a>
      </section>
    )}
    {owners.length && (
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.owenersLabel}
        />
        {owners.map((owner: UserType, index: number) => (
          <ColonyMetaUserAvatar user={owner} key={`owner_${index + 1}`} />
        ))}
      </section>
    )}
    {admins.length && (
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.adminsLabel}
        />
        {admins.map((admin: UserType, index: number) => (
          <ColonyMetaUserAvatar user={admin} key={`owner_${index + 1}`} />
        ))}
      </section>
    )}
  </div>
);

ColonyMeta.displayName = displayName;

export default ColonyMeta;
