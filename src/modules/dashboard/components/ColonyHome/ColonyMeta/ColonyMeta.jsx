/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { stripProtocol } from '~utils/strings';
import { useDataFetcher } from '~utils/hooks';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { rolesFetcher } from '../../../fetchers';

import styles from './ColonyMeta.css';

import type { ColonyType, RolesType } from '~immutable';

const MSG = defineMessages({
  websiteLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.websiteLabel',
    defaultMessage: 'Website',
  },
  guidelineLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.guidelineLabel',
    defaultMessage: 'Contribute Guidelines',
  },
  founderLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.founderLabel',
    defaultMessage: 'Colony Founder',
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

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });
const UserAvatar = HookedUserAvatar();

type Props = {|
  colony: ColonyType,
  canAdminister: boolean,
|};

const ColonyMeta = ({
  colony: {
    colonyAddress,
    description,
    colonyName,
    guideline,
    displayName,
    website,
  },
  colony,
  canAdminister,
}: Props) => {
  const { data: roles } = useDataFetcher<RolesType>(
    rolesFetcher,
    [colonyName],
    [colonyName],
  );

  const { admins, founder } = roles || {};

  return (
    <div>
      <ColonyAvatar
        className={styles.avatar}
        address={colonyAddress}
        colony={colony}
        size="xl"
      />
      <section className={styles.headingWrapper}>
        <Heading appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}>
          <Fragment>
            <span>{displayName}</span>
            {canAdminister && (
              <Link
                className={styles.editColony}
                to={`/colony/${colonyName}/admin`}
              >
                <Icon name="settings" title={MSG.editColonyTitle} />
              </Link>
            )}
          </Fragment>
        </Heading>
      </section>
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
      {founder && (
        <section className={styles.dynamicSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.founderLabel}
          />
          <UserAvatar
            key={`founder_${founder}`}
            address={founder}
            className={styles.userAvatar}
            showInfo
            showLink
          />
        </section>
      )}
      {admins && admins.length ? (
        <section className={styles.dynamicSection}>
          <Heading
            appearance={{ margin: 'none', size: 'small', theme: 'dark' }}
            text={MSG.adminsLabel}
          />
          {admins.map((adminAddress: string) => (
            <UserAvatar
              key={`admin_${adminAddress}`}
              address={adminAddress}
              className={styles.userAvatar}
              showInfo
              showLink
            />
          ))}
        </section>
      ) : null}
    </div>
  );
};

ColonyMeta.displayName = 'dashboard.ColonyHome.ColonyMeta';

export default ColonyMeta;
