import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DomainType } from '~immutable/index';
import { useDataFetcher, useSelector, useUserDomainRoles } from '~utils/hooks';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';
import { Address } from '~types/index';

import { ROOT_DOMAIN } from '../../../core/constants';
import { canAdminister } from '../../../users/checks';
import { walletAddressSelector } from '../../../users/selectors';
import { domainsFetcher } from '../../../dashboard/fetchers';
import OrganizationAddDomains from '../Domains/OrganizationAddDomains';
import DomainList from './DomainList';

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
  const walletAddress = useSelector(walletAddressSelector);

  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const { data: newRoles } = useUserDomainRoles(
    colonyAddress,
    ROOT_DOMAIN,
    walletAddress,
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
            viewOnly={!canAdminister(newRoles)}
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
