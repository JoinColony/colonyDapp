import { FieldArray, useField } from 'formik';
import { nanoid } from 'nanoid';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { Colony } from '~data/index';

import { newRate } from './FundingSource/constants';

import SingleFundingSource from './SingleFundingSource';
import { newFundingSource } from './constants';
import { Streaming as StreamingType } from './types';
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

export interface Props {
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
            {fundingSources?.map((fundingSource, index) => (
              <SingleFundingSource
                {...{
                  fundingSource,
                  index,
                  onToggleButtonClick,
                  remove,
                  sidebarRef,
                  colony,
                }}
                allFundingSources={fundingSources}
              />
            ))}
            <Button
              onClick={() => {
                push({
                  ...newFundingSource,
                  id: nanoid(),
                  rate: [
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
