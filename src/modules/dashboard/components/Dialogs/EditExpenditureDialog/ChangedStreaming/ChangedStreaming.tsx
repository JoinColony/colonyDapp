import React, { Fragment, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { nanoid } from 'nanoid';
import { startCase } from 'lodash';

import Button from '~core/Button';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import ChangeHeader from '../ChangeHeader';
import ChangeItem from '../ChangeItem';
import { NewValueType } from '../types';

import ChangedFundingSource from './ChangedFundingSource';
import { fundingSourceWasChanged, isStreamingPaymentType } from './utils';
import styles from './ChangedStreaming.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedStreaming.discard',
    defaultMessage: 'Discard',
  },
  streaming: {
    id: 'dashboard.EditExpenditureDialog.ChangedStreaming.streaming',
    defaultMessage: 'Change Streaming',
  },
  fundingSource: {
    id: 'dashboard.EditExpenditureDialog.ChangedStreaming.fundingSource',
    defaultMessage: 'Change Funding Source',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedStreaming';
export const skip = ['id', 'isExpanded', 'created', 'released', 'percent'];

interface Props {
  newValues?: NewValueType;
  colony: Colony;
  oldValues: ValuesType;
  discardChange: (name: string) => void;
}

const ChangedStreaming = ({
  newValues,
  oldValues,
  colony,
  discardChange,
}: Props) => {
  const { formatMessage } = useIntl();

  const changed = useMemo(() => {
    if (
      typeof newValues?.value !== 'object' ||
      !isStreamingPaymentType(newValues.value)
    ) {
      return undefined;
    }

    const { fundingSources, ...rest } = newValues.value || {};
    const streaming = Object.entries(rest)
      .map(([key, value]) => ({ key, value, id: nanoid() }))
      .filter(({ key, value }) => {
        return !(skip.includes(key) || Array.isArray(value));
      });

    return {
      streaming,
      fundingSources,
    };
  }, [newValues]);

  if (!newValues || !changed) {
    return null;
  }

  return (
    <>
      {changed.streaming.map(({ key, value, id }) => {
        const oldValue = oldValues[newValues?.key || 'streaming']?.[key];

        return (
          <Fragment key={id}>
            <ChangeHeader name={startCase(key)} />
            <ChangeItem
              newValue={value}
              oldValue={oldValue}
              key={id}
              colony={colony}
              name={key}
            />
          </Fragment>
        );
      })}
      {changed.fundingSources?.map((fundingSource, idx) => {
        const oldFundingSource = oldValues?.streaming?.fundingSources?.find(
          (fundingSourceItem) => fundingSourceItem.id === fundingSource.id,
        );

        // checking if only limit has been changed
        // (limit is set to 0 when endDate is changing to optin other than 'limit-is-reached'),
        // but we don't want to show this change
        const noChanges = !fundingSourceWasChanged({
          newValue: fundingSource,
          oldValue: oldFundingSource,
          endDate:
            newValues.value?.['endDate']?.option ||
            oldValues?.streaming?.endDate?.option,
        });

        if (noChanges) {
          return null;
        }
        return (
          <Fragment key={fundingSource.id}>
            <ChangeHeader
              name={formatMessage(MSG.fundingSource)}
              count={idx + 1}
              withCounter
            />
            <ChangedFundingSource
              fundingSource={fundingSource}
              oldFundingSource={oldFundingSource}
              colony={colony}
            />
          </Fragment>
        );
      })}
      <div className={styles.buttonWrappper}>
        <Button
          className={styles.discard}
          onClick={() => discardChange(newValues?.key || '')}
          text={MSG.discard}
        />
      </div>
    </>
  );
};

ChangedStreaming.displayName = displayName;

export default ChangedStreaming;
