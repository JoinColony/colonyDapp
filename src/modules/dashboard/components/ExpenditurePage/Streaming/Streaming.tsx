import { FieldArray, useField } from 'formik';
import { nanoid } from 'nanoid';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import { CollapseExpandButtons } from '~dashboard/ExpenditurePage/Payments';
import { Colony } from '~data/index';

import { newFundingSource } from './constants';
import { Streaming as StreamingType } from './types';
import FundingSource from './FundingSource';
import { newRate } from './FundingSource/constants';
import styles from './Streaming.css';

const MSG = defineMessages({
  fundingSource: {
    id: 'dashboard.ExpenditurePage.Streaming.fundingSource',
    defaultMessage: 'Funding source',
  },
  title: {
    id: 'dashboard.ExpenditurePage.Streaming.title',
    defaultMessage: '{nr}: {team}',
  },
  team: {
    id: 'dashboard.ExpenditurePage.Streaming.team',
    defaultMessage: 'Team',
  },
  rate: {
    id: 'dashboard.ExpenditurePage.Streaming.rate',
    defaultMessage: 'Rate',
  },
  addFundingSource: {
    id: 'dashboard.ExpenditurePage.Streaming.addFundingSource',
    defaultMessage: 'Add funding source',
  },
  notSet: {
    id: 'dashboard.ExpenditurePage.Streaming.notSet',
    defaultMessage: 'Not set',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming';

interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const Streaming = ({ colony, sidebarRef }: Props) => {
  const [, { value: fundingSources }, { setValue }] = useField<
    StreamingType['fundingSources']
  >('streaming.fundingSources');

  const onToggleButtonClick = useCallback(
    (index) => {
      setValue(
        fundingSources?.map((fundingSource, idx) =>
          index === idx
            ? { ...fundingSource, isExpanded: !fundingSource.isExpanded }
            : fundingSource,
        ),
      );
    },
    [fundingSources, setValue],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FormattedMessage {...MSG.fundingSource} />
      </div>
      <FieldArray
        name="streaming.fundingSources"
        render={({ push, remove }) => (
          <>
            {fundingSources?.map((fundingSource, index) => {
              const domain = colony?.domains.find(
                ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
              );

              return (
                <div
                  className={styles.singleFundingSource}
                  key={fundingSource.id}
                >
                  <FormSection>
                    <div className={styles.fundingSourceLabel}>
                      <CollapseExpandButtons
                        isExpanded={fundingSource.isExpanded}
                        onToogleButtonClick={() => onToggleButtonClick(index)}
                        isLastItem={index === fundingSources?.length - 1}
                      />
                      <FormattedMessage
                        {...MSG.title}
                        values={{ nr: index + 1, team: domain?.name }}
                      />
                      {fundingSources?.length > 1 && (
                        <Icon
                          name="trash"
                          className={styles.deleteIcon}
                          onClick={() => remove(index)}
                        />
                      )}
                    </div>
                  </FormSection>
                  <FundingSource
                    sidebarRef={sidebarRef}
                    colony={colony}
                    index={index}
                    fundingSource={fundingSource}
                    isLast={index === fundingSources?.length - 1}
                  />
                </div>
              );
            })}
            <Button
              onClick={() => {
                push({
                  ...newFundingSource,
                  id: nanoid(),
                  rates: [
                    {
                      ...newRate,
                      id: nanoid(),
                      token: colony?.nativeTokenAddress,
                    },
                  ],
                });
              }}
              appearance={{ theme: 'blue' }}
            >
              <div className={styles.addFundingSourceLabel}>
                <Icon name="plus-circle" className={styles.circlePlusIcon} />
                <FormattedMessage {...MSG.addFundingSource} />
              </div>
            </Button>
          </>
        )}
      />
    </div>
  );
};

Streaming.displayName = displayName;

export default Streaming;
