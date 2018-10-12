/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { stripProtocol } from '~utils/strings';

import Heading from '~core/Heading';
import ColonyAvatar from '~core/ColonyAvatar';
import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import UserAvatar from '~core/UserAvatar';

import styles from './ColonyMeta.css';

import type { ColonyType } from '~types/colony';
import type { UserType } from '~types/user';

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
  editColonyTitle: {
    id: 'dashboard.ColonyHome.ColonyMeta.editColonyTitle',
    defaultMessage: 'Edit Colony',
  },
});

const displayName: string = 'dashboard.ColonyHome.ColonyMeta';

type Props = {
  colony: ColonyType,
  owners: Array<UserType>,
  admins: Array<UserType>,
  isAdmin: boolean,
};

const ColonyMeta = ({
  colony: { avatar, name, address, description, website, guideline },
  owners,
  admins,
  isAdmin,
}: Props) => (
  <div>
    <ColonyAvatar
      className={styles.avatar}
      avatarURL={avatar}
      colonyAddress={address}
      colonyName={name}
      size="xl"
    />
    <Heading appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}>
      <Fragment>
        <span>{name}</span>
        {isAdmin && (
          <NavLink className={styles.editColony} to="/admin/profile">
            <Icon name="settings" title={MSG.editColonyTitle} />
          </NavLink>
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
    {owners.length && (
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.owenersLabel}
        />
        {owners.map(
          (
            {
              avatar: ownerAvatar,
              walletAddress: ownerWalletAddress,
              displayName: ownerDisplayName,
              ensName: ownerUsername,
            }: UserType,
            index: number,
          ) => (
            <UserAvatar
              key={`owner_${index + 1}`}
              className={styles.userAvatar}
              avatarURL={ownerAvatar}
              walletAddress={ownerWalletAddress}
              displayName={ownerDisplayName}
              username={ownerUsername}
              hasUserInfo
            />
          ),
        )}
      </section>
    )}
    {admins.length && (
      <section className={styles.dynamicSection}>
        <Heading
          appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
          text={MSG.adminsLabel}
        />
        {admins.map(
          (
            {
              avatar: adminAvatar,
              walletAddress: adminWalletAddress,
              displayName: adminDisplayName,
              ensName: adminUsername,
            }: UserType,
            index: number,
          ) => (
            <UserAvatar
              key={`admin_${index + 1}`}
              className={styles.userAvatar}
              avatarURL={adminAvatar}
              walletAddress={adminWalletAddress}
              displayName={adminDisplayName}
              username={adminUsername}
              hasUserInfo
            />
          ),
        )}
      </section>
    )}
  </div>
);

ColonyMeta.displayName = displayName;

export default ColonyMeta;
