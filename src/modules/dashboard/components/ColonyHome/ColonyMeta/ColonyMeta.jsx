/* @flow */

// $FlowFixMe
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { stripProtocol } from '~utils/strings';
import { useDataFetcher } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { ACTIONS } from '~redux';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import { ActionButton } from '~core/Button';
import { Tooltip } from '~core/Popover';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { currentUserColoniesFetcher, rolesFetcher } from '../../../fetchers';

import styles from './ColonyMeta.css';

import type { ColonyType, RolesType } from '~immutable';
import type { Address } from '~types';

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
  subscribe: {
    id: 'dashboard.ColonyHome.ColonyMeta.subscribe',
    defaultMessage: 'Add to My Colonies',
  },
  unsubscribe: {
    id: 'dashboard.ColonyHome.ColonyMeta.unsubscribe',
    defaultMessage: 'Remove from My Colonies',
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
    [colonyAddress],
    [colonyAddress],
  );
  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    currentUserColoniesFetcher,
    [],
    [],
  );
  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);
  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  const { admins, founder } = roles || {};

  return (
    <div>
      <div className={styles.colonyAvatar}>
        <ColonyAvatar
          className={styles.avatar}
          colonyAddress={colonyAddress}
          colony={colony}
          size="xl"
        />
        {isSubscribed ? (
          <Tooltip
            content={
              <span>
                <FormattedMessage {...MSG.unsubscribe} />
              </span>
            }
          >
            <ActionButton
              className={styles.unsubscribe}
              error={ACTIONS.USER_COLONY_UNSUBSCRIBE_ERROR}
              submit={ACTIONS.USER_COLONY_UNSUBSCRIBE}
              success={ACTIONS.USER_COLONY_UNSUBSCRIBE_SUCCESS}
              transform={transform}
            />
          </Tooltip>
        ) : (
          <Tooltip
            content={
              <span>
                <FormattedMessage {...MSG.subscribe} />
              </span>
            }
          >
            <ActionButton
              className={styles.subscribe}
              error={ACTIONS.USER_COLONY_SUBSCRIBE_ERROR}
              submit={ACTIONS.USER_COLONY_SUBSCRIBE}
              success={ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS}
              transform={transform}
            />
          </Tooltip>
        )}
      </div>
      <section className={styles.headingWrapper}>
        <Heading appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}>
          <>
            <span>{displayName}</span>
            {canAdminister && (
              <Link
                className={styles.editColony}
                to={`/colony/${colonyName}/admin`}
              >
                <Icon name="settings" title={MSG.editColonyTitle} />
              </Link>
            )}
          </>
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
