/* @flow */

import React, { Fragment } from 'react';
import { List } from 'immutable';
import { defineMessages } from 'react-intl';

import { stripProtocol } from '~utils/strings';

import Heading from '~core/Heading';
import ColonyAvatar from '~core/ColonyAvatar';
import Icon from '~core/Icon';
import Link from '~core/Link';
import UserAvatar from '~core/UserAvatar';

import styles from './ColonyMeta.css';

import type { ColonyRecord, UserRecord } from '~immutable';
import type { DataRecord } from '~utils/reducers';

const MSG = defineMessages({
  websiteLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.websiteLabel',
    defaultMessage: 'Website',
  },
  guidelineLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.guidelineLabel',
    defaultMessage: 'Contribute Guidelines',
  },
  foundersLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.foundersLabel',
    defaultMessage: 'Colony Founders',
  },
  adminsLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.adminsLabel',
    defaultMessage: 'Colony Admins',
  },
  editColonyTitle: {
    id: 'dashboard.ColonyHome.ColonyMeta.editColonyTitle',
    defaultMessage: 'Edit Colony',
  },
});

const displayName: string = 'dashboard.ColonyHome.ColonyMeta';

type Props = {
  colony: DataRecord<ColonyRecord>,
  founders: List<UserRecord>,
  admins: List<UserRecord>,
  isAdmin: boolean,
};

const ColonyMeta = ({ colony, founders, admins, isAdmin }: Props) => {
  const {
    data: { address, avatar, description, ensName, guideline, name, website },
  } = colony;
  return (
    <div>
      <ColonyAvatar
        address={address}
        avatar={avatar}
        name={name}
        ensName={ensName}
        className={styles.avatar}
        size="xl"
      />
      <Heading appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}>
        <Fragment>
          <span>{name}</span>
          {isAdmin && (
            <Link className={styles.editColony} to={`/colony/${ensName}/admin`}>
              <Icon name="settings" title={MSG.editColonyTitle} />
            </Link>
          )}
        </Fragment>
      </Heading>
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
      {founders.size && (
        <section className={styles.dynamicSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.foundersLabel}
          />
          {founders.map((founder, index) => (
            <UserAvatar
              key={`founder_${index + 1}`}
              className={styles.userAvatar}
              hasUserInfo
              {...founder}
            />
          ))}
        </section>
      )}
      {admins.size && (
        <section className={styles.dynamicSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.adminsLabel}
          />
          {admins.map((admin, index) => (
            <UserAvatar
              key={`admin_${index + 1}`}
              className={styles.userAvatar}
              hasUserInfo
              {...admin}
            />
          ))}
        </section>
      )}
    </div>
  );
};

ColonyMeta.displayName = displayName;

export default ColonyMeta;
