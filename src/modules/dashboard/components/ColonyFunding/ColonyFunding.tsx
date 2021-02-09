import React, { ComponentProps, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { RouteChildrenProps } from 'react-router';
import sortBy from 'lodash/sortBy';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Form, Select } from '~core/Fields';
import Heading from '~core/Heading';
import ColonyFundingBanner from '~dashboard/ColonyFundingBanner';
import ColonyFundingMenu from '~dashboard/ColonyFundingMenu';
import TokenCardList from '~dashboard/TokenCardList';
import { useColonyFromNameQuery } from '~data/index';

import styles from './ColonyFunding.css';

const MSG = defineMessages({
  labelSelectDomain: {
    id: 'dashboard.ColonyFunding.labelSelectDomain',
    defaultMessage: 'Select a domain',
  },
  title: {
    defaultMessage: 'Funds',
    id: 'dashboard.ColonyFunding.title',
  },
});

type Props = RouteChildrenProps<{ colonyName: string }>;

const componentDisplayName = 'dashboard.ColonyFunding';

const ColonyFunding = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${componentDisplayName} Please check route setup.`,
    );
  }
  const { colonyName } = match.params;
  const { formatMessage } = useIntl();

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const { data } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  const domainChoices = useMemo<
    ComponentProps<typeof Select>['options']
  >(() => {
    if (!data || !data.processedColony) {
      return [];
    }
    const {
      processedColony: { domains },
    } = data;
    return [
      {
        value: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
        label: { id: 'domain.all' },
      },
      ...sortBy(
        domains.map(({ ethDomainId, name }) => ({
          label: name,
          value: ethDomainId.toString(),
        })),
        ['value'],
      ),
    ];
  }, [data]);

  const selectedDomainLabel: string = useMemo(() => {
    const { label = '' } =
      domainChoices.find(
        ({ value }) => value === selectedDomainId.toString(),
      ) || {};
    return typeof label === 'string' ? label : formatMessage(label);
  }, [domainChoices, formatMessage, selectedDomainId]);

  if (!data) {
    return null;
  }

  const { processedColony: colony } = data;

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div>
          <div className={styles.titleContainer}>
            <Heading
              text={MSG.title}
              textValues={{ selectedDomainLabel }}
              appearance={{ size: 'medium', theme: 'dark' }}
            />
            <Form
              initialValues={{
                selectDomain: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString(),
              }}
              onSubmit={() => {}}
            >
              <Select
                appearance={{
                  alignOptions: 'right',
                  width: 'content',
                  theme: 'alt',
                }}
                elementOnly
                label={MSG.labelSelectDomain}
                name="selectDomain"
                onChange={(value) => setSelectedDomainId(Number(value))}
                options={domainChoices}
              />
            </Form>
          </div>
          <TokenCardList
            appearance={{ numCols: '3' }}
            nativeTokenAddress={colony.nativeTokenAddress}
            tokens={colony.tokens}
            domainId={selectedDomainId}
          />
        </div>
        <div className={styles.banner}>
          <ColonyFundingBanner colonyAddress={colony.colonyAddress} />
        </div>
      </div>
      <aside className={styles.aside}>
        <ColonyFundingMenu
          selectedDomainId={selectedDomainId}
          colony={colony}
        />
      </aside>
    </div>
  );
};

ColonyFunding.displayName = componentDisplayName;

export default ColonyFunding;
