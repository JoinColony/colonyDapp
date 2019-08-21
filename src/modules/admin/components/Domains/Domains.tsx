/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { canAdminister } from '../../../users/checks';
import { domainsFetcher } from '../../../dashboard/fetchers';
import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { useDataFetcher } from '~utils/hooks';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';
import OrganizationAddDomains from '../Organizations/OrganizationAddDomains';
import DomainList from './DomainList';

import { Address } from '~types/index';
import { DomainType, UserPermissionsType } from '~immutable/index';

import styles from './Domains.css';

interface Props {
  colonyAddress: Address;
}

const MSG = defineMessages({
  title: {
    id: 'admin.Domains.title',
    defaultMessage: 'Domains',
  },
  noCurrentDomains: {
    id: 'admin.Domains.noCurrentDomains',
    defaultMessage: `
      It looks like no domains are currently added to this colony.
      You can add one by adding through the input field above.
    `,
  },
});

const displayName = 'admin.Domains';

const Domains = ({ colonyAddress }: Props) => {
  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const { data: permissions } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    [colonyAddress || undefined],
    [colonyAddress || undefined],
  );

  if (!domains) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
      </div>
      <OrganizationAddDomains colonyAddress={colonyAddress} />
      <section className={styles.list}>
        {/*
         * DomainList follows the design principles from TaskList in dashboard,
         * but if it turns out we're going to use this in multiple places,
         * we should consider moving it to core
         */}
        {domains && domains.length ? (
          <DomainList
            colonyAddress={colonyAddress}
            domains={domains}
            label={MSG.title}
            viewOnly={!canAdminister(permissions)}
          />
        ) : (
          <>
            <Heading
              appearance={{
                size: 'small',
                weight: 'bold',
                margin: 'small',
              }}
              text={MSG.title}
            />
            <p>
              <FormattedMessage {...MSG.noCurrentDomains} />
            </p>
          </>
        )}
      </section>
    </div>
  );
};

Domains.displayName = displayName;

export default Domains;
